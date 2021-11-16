from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

react_num_per_sec = {"positive": 0, "neutral": 0, "negative": 0, "createdAtArray": [], "scoreArray": []}
react_num_per_min = {"positive": 0, "neutral": 0, "negative": 0}
top_five_hashtags_per_min = {'hashtag01': 0, 'hashtag02': 0, 'hashtag03': 0, 'hashtag04': 0, 'hashtag05': 0}


@app.route('/')
def open_dashboard_page():
    return render_template('dashboard.html')


@app.route('/update_react_num_per_sec', methods=['POST'])
def update_react_num_per_sec():
    global react_num_per_sec
    react_num_per_sec['positive'] = request.form['positive_num']
    react_num_per_sec['neutral'] = request.form['neutral_num']
    react_num_per_sec['negative'] = request.form['negative_num']
    react_num_per_sec['createdAtArray'] = request.form['createdAtArray']
    react_num_per_sec['scoreArray'] = request.form['scoreArray']
    return 'success', 200


@app.route('/update_react_num_per_min', methods=['POST'])
def update_react_num_per_min():
    global react_num_per_min
    react_num_per_min['positive'] = request.form['positive_num']
    react_num_per_min['neutral'] = request.form['neutral_num']
    react_num_per_min['negative'] = request.form['negative_num']
    return 'success', 200


@app.route('/update_top_five_hashtags_per_min', methods=['POST'])
def update_top_five_hashtags_per_min():
    global top_five_hashtags_per_min
    top_five_hashtags_per_min = request.form['data']
    return 'success', 200


@app.route('/refresh_react_num_per_sec')
def refresh_react_num_per_sec():
    return react_num_per_sec


@app.route('/refresh_react_num_per_min')
def refresh_react_num_per_min():
    return react_num_per_min


@app.route('/refresh_top_five_hashtags_per_min')
def refresh_top_five_hashtags_per_min():
    return top_five_hashtags_per_min


if __name__ == "__init__":
    app.run()

