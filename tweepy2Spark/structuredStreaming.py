import ast
import json
from langdetect import detect
from textblob import TextBlob
from pyspark.sql import SparkSession
from pyspark.sql.functions import udf
from pyspark.sql.functions import json_tuple
from pyspark.sql.functions import col

# Open the Session.
spark = SparkSession \
    .builder \
    .appName("Predicting TweetWorld Emotion") \
    .getOrCreate()


# Define UDFs
def double_quotes_json(json_single):
    """
    Get Double quotes json form from single quotes Json form.
    """

    json_dict = ast.literal_eval(json_single)
    return json.dumps(json_dict)


def detect_language(text):
    return detect(text)


def get_sentiment(text):
    # positive: 2, netural: 1, negotive: 0
    sentiment = TextBlob(text).sentiment.polarity

    if sentiment > 0:
        return 2
    elif sentiment < 0:
        return 0
    else:
        return 1


double_quotes_json_udf = udf(lambda x: double_quotes_json(x))
detect_language_udf = udf(lambda x: detect_language(x))
get_sentiment_utf = udf(lambda x: get_sentiment(x))


# Load sample data and get schema.
with open("data/sample_tweet.txt", 'r') as f:
    originSingleQuotes = f.readline()
    originDoubleQuotes = double_quotes_json(originSingleQuotes)

sc = spark.sparkContext
originRDD = sc.parallelize([originDoubleQuotes])
originDF = spark.read.json(originRDD)
columns = originDF.columns

# Send a connection request to the Server Socket.
socketDF = spark \
    .readStream \
    .format("socket") \
    .option("host", "localhost") \
    .option("port", 9999) \
    .load()


# PreProcessing for extract data available.
jsonDF = socketDF.select(double_quotes_json_udf("value").alias("value"))
multiColDF = jsonDF.select(json_tuple("value", *columns)).toDF(*columns)

# Select columns and adjust preprocessing with UDF.
df = multiColDF.select("created_at", "text")
df = df.select("created_at", "text", detect_language_udf("text").alias("lang"))
df = df.filter(col("lang") == "en")
sentimentDF = df.select("created_at", "text", get_sentiment_utf(col("text")).alias("sentiment_level"))

# Let's launch our Spark
launch = sentimentDF \
    .writeStream \
    .outputMode("append") \
    .queryName("sentimentDF") \
    .format("console") \
    .start()

launch.awaitTermination()