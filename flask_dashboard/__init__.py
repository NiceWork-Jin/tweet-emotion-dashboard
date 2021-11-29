from flask import Flask, render_template, request

app = Flask(__name__)

sentiment_level_number_1_sec = {"positive": 0, "neutral": 0, "negative": 0}
sentiment_level_number_1_min = {"positive": 0, "neutral": 0, "negative": 0}
top_five_hashtags_1_min = {}
sentiment_score_time_series = {"createdAtArray": [], "scoreArray": []}


@app.route('/')
def open_dashboard_page():
    return render_template('dashboard.html')


@app.route('/update/sentiment_level_number/sec/1', methods=['POST'])
def update_sentiment_level_number_1_sec():
    global sentiment_lzevel_number_1_sec
    sentiment_level_number_1_sec['positive'] = request.form['positive']
    sentiment_level_number_1_sec['neutral'] = request.form['neutral']
    sentiment_level_number_1_sec['negative'] = request.form['negative']
    return 'success', 200


@app.route('/update/sentiment_level_number/min/1', methods=['POST'])
def update_sentiment_level_number_1_min():
    global sentiment_level_number_1_min
    sentiment_level_number_1_min['positive'] = request.form['positive']
    sentiment_level_number_1_min['neutral'] = request.form['neutral']
    sentiment_level_number_1_min['negative'] = request.form['negative']
    return 'success', 200


@app.route('/update/top_five_hashtags/min/1', methods=['POST'])
def update_top_five_hashtags_1_min():
    global top_five_hashtags_1_min
    top_five_hashtags_1_min = request.form['data']
    return 'success', 200


@app.route('/update/sentiment_score_time_series', methods=['POST'])
def update_sentiment_score_time_series():
    global sentiment_score_time_series
    sentiment_score_time_series['createdAtArray'] = request.form['createdAtArray']
    sentiment_score_time_series['scoreArray'] = request.form['scoreArray']
    return 'success', 200


@app.route('/get/sentiment_level_number/sec/1')
def get_sentiment_level_number_1_sec():
    return sentiment_level_number_1_sec


@app.route('/get/sentiment_level_number/min/1')
def get_sentiment_level_number_1_min():
    return sentiment_level_number_1_min


@app.route('/get/top_five_hashtags/min/1')
def get_top_five_hashtags_per_min():
    return top_five_hashtags_1_min


@app.route('/get/sentiment_score_time_series')
def get_sentiment_score_time_series():
    return sentiment_score_time_series


if __name__ == "__init__":
    app.run()

