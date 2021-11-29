from pyspark.sql import SparkSession
from pyspark.sql.functions import udf
from pyspark.sql.types import TimestampType
from pyspark.sql.functions import json_tuple
from pyspark.sql.functions import col
from pyspark.sql.functions import regexp_extract
from pyspark.sql.functions import window, rank, sum
from pyspark.sql.window import Window
import requests
import ast
import json
from langdetect import detect
from textblob import TextBlob
import datetime
import os
import shutil


spark = SparkSession \
    .builder \
    .appName("Predicting TweetWorld Emotion") \
    .getOrCreate()

spark.conf.set("spark.sql.shuffle.partitions", "1")


# UTFs
def convert_json_double(json_single):
    json_dict = ast.literal_eval(json_single)
    return json.dumps(json_dict)


def detect_language(text):
    return detect(text)


def get_sentiment(text):
    sentiment = TextBlob(text).sentiment.polarity
    if sentiment > 0:
        return 100  # Positive
    elif sentiment < 0:
        return 0  # Negative
    else:
        return 50  # Neutral


def from_created_at(x):
    """
    parsing format : "https://docs.python.org/3/library/datetime.html#datetime.date"

    The valuable of 'x' has a form of 'Thu Oct 21 07:02:44 +0000 2021'
    """
    dt = datetime.datetime.strptime(x, "%a %b %d %H:%M:%S %z %Y")
    return dt.isoformat()


convert_json_double_udf = udf(lambda x: convert_json_double(x))
detect_language_udf = udf(lambda x: detect_language(x))
get_sentiment_utf = udf(lambda x: get_sentiment(x))
from_created_at_udf = udf(lambda x: from_created_at(x))


# Load Data
# Use sample data to easily extract column names through inferSchema
with open("./data/sample_tweet.txt", 'r') as f:
    SingleQuotesJSON = f.readline()
    DoubleQuotesJSON = convert_json_double(SingleQuotesJSON)

sampleRDD = spark.sparkContext.parallelize([DoubleQuotesJSON])
sampleDF = spark.read.json(sampleRDD)
columns = sampleDF.columns

# Read Streaming data from socket
socketDF = spark \
    .readStream \
    .format("socket") \
    .option("host", "localhost") \
    .option("port", 9999) \
    .load()


# Load only neccesary data
originDF = socketDF.select(convert_json_double_udf("value").alias("value")) \
    .select(json_tuple("value", *columns)).toDF(*columns) \
    .select("created_at", "text")


# Pre-processing
readyDF = originDF.select(
    # Convert the form of "created_at" to ISO format for casting as TimestampType.
    from_created_at_udf(col("created_at")).cast(TimestampType()).alias("created_at"),

    # Estimate sentiment level. Positive, Neutral and Negative.
    get_sentiment_utf(col("text")).alias("sentiment_level"),

    # Verify langage through text.
    detect_language_udf(col("text")).alias("lang"),

    # Extract a hashtag from the text. It starts with "@"
    regexp_extract(col("text"), '(@\w+)', 1).alias("hashtag")
).filter(col("lang") == "en")


# Intermediate Save before executing window functions
file_name = "ready_table"

spark_warehouse_loc = f'./spark-warehouse/{file_name}'
checkpoint_loc = f'./checkpoint/dir/{file_name}'

if os.path.exists(spark_warehouse_loc):
    shutil.rmtree(spark_warehouse_loc)

if os.path.exists(checkpoint_loc):
    shutil.rmtree(checkpoint_loc)

readyDF.writeStream \
    .option("checkpointLocation", checkpoint_loc) \
    .toTable(file_name)


# Window Function
class WindowAggregator(object):
    def __init__(self, url, host='127.0.0.1', port=5000):
        self.target = f'http://{host}:{port}/{url}'

    def sentiment_level_num(self, df, epoch_id):
        countByLevelDF = df \
            .groupBy("window") \
            .pivot("sentiment_level", ['100', '50', '0']) \
            .sum("count") \
            .drop("window") \
            .na.fill(0) \
            .toDF('positive', 'neutral', 'negative')

        self.send_data(countByLevelDF)

    def hashtag_top_five(self, df, epoch_id):
        window = Window \
            .partitionBy(df['window']) \
            .orderBy(df['count'].desc(), df['hashtag'])

        rank4SortDF = df \
            .select('*', rank().over(window).alias('rank')) \
            .filter(col('rank') <= 2)

        hashTagTopFiveDF = rank4SortDF \
            .groupBy("window") \
            .pivot("hashtag") \
            .agg(sum("count")) \
            .drop("window")

        self.send_data_with_nested_form(hashTagTopFiveDF)

    def sentiment_score_timeseries(self, df, epoch_id):
        df02 = df \
            .orderBy("created_at") \
            .drop("window")

        self.send_data_with_nested_list_form(df02)


    def send_data(self, df):
        data_list = df \
            .toJSON() \
            .collect()

        if not data_list:
            return

        for data in data_list:
            requests.post(
                self.target,
                data=json.loads(data)
            )

    def send_data_with_nested_form(self, df):
        data_list = df \
            .toJSON() \
            .collect()

        if not data_list:
            return

        for data in data_list:
            form = {'data': ''}
            form_inner = json.dumps(ast.literal_eval(data))
            form['data'] = form_inner

            requests.post(
                self.target,
                data=form
            )

    def send_data_with_nested_list_form(self, df):
        data = {}

        created_at = []
        score = []
        for row in df.collect():
            created_at.append(row.created_at.isoformat())
            score.append(row.score)

        if not created_at:
            return

        data["createdAtArray"] = json.dumps(created_at)
        data["scoreArray"] = json.dumps(score)

        requests.post(
            self.target,
            data=data
        )


# Sentiment_level_Sec
sentimentLevelNumSecDF = spark.readStream \
    .table("ready_table") \
    .withWatermark("created_at", "2 seconds") \
    .groupBy(
        window(col("created_at"), "1 seconds"), col("sentiment_level")
    ) \
    .count()

exec_sentimentLevelNumSecDF = sentimentLevelNumSecDF \
    .writeStream \
    .foreachBatch(
        WindowAggregator('update/sentiment_level_number/sec/1') \
        .sentiment_level_num) \
    .start()


# Sentiment_level_Min
sentimentLevelNumMinDF = spark.readStream \
    .table("ready_table") \
    .withWatermark("created_at", "1 minutes") \
    .groupBy(
        window(col("created_at"), "1 minutes", "50 seconds"), col("sentiment_level")
    ) \
    .count()

exec_sentimentLevelNumSecDF = sentimentLevelNumMinDF \
    .writeStream \
    .foreachBatch(
        WindowAggregator('update/sentiment_level_number/min/1') \
        .sentiment_level_num) \
    .start()


# Top5 HashTag
HashTagNumMinDF = spark.readStream \
    .table("ready_table") \
    .withWatermark("created_at", "1 minutes") \
    .groupBy(
        window(col("created_at"), "1 minutes", "50 seconds"), col("hashtag")
    ) \
    .count() \
    .where(col("hashtag") != '')

exec_sentimentLevelNumSecDF = HashTagNumMinDF \
    .writeStream \
    .foreachBatch(
        WindowAggregator('update/top_five_hashtags/min/1') \
        .hashtag_top_five) \
    .start()


# SentimentScore_TimeSeires
sentimentScoreTimeSeriesDF = spark.readStream \
    .table("ready_table") \
    .withWatermark("created_at", "2 seconds") \
    .groupBy(
        window(col("created_at"), "1 minutes", "50 seconds"), col("created_at"), col("sentiment_level").alias("score") \
    ) \
    .mean()

exec_sentimentScoreTimeSeriesDF = sentimentScoreTimeSeriesDF \
    .writeStream \
    .foreachBatch(
        WindowAggregator('update/sentiment_score_time_series') \
        .sentiment_score_timeseries) \
    .start()

spark.streams.awaitAnyTermination()