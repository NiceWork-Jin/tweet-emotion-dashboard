"use strict";
// Chart : This presents the number of Sentiment levels by bar chart with seconds.
const reactNumPerSecBarId = document.getElementById('reactNumPerSecBar').getContext('2d');
const reactNumPerSecBar = new Chart(reactNumPerSecBarId, {
    type: 'bar',
    data: {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [{
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ]
        }]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: '긍정, 중립, 부정 개수/초',
            },
            legend: {
                display: false
            }
        }
    }
});

// Chart : This presents an average score for each second. The maximum amount of data is limited to 60.
const reactScorePerSecTimeSeriesId = document.getElementById('reactScorePerSecTimeSeries').getContext('2d');
const reactScorePerSecTimeSeries = new Chart(reactScorePerSecTimeSeriesId, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: '',
            data: [],
            borderColor: 'blue'
        }]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: '감정반응 점수 누적/초',
            },
            legend: {
                display: false
            }
        }
    }
});


function refreshScore(){
    const total = RECENT_VALUES_PER_SEC_ARRAY.positive + RECENT_VALUES_PER_SEC_ARRAY.neutral + RECENT_VALUES_PER_SEC_ARRAY.negative;
    let sumWithWeight = 1 * RECENT_VALUES_PER_SEC_ARRAY.positive + -1 * RECENT_VALUES_PER_SEC_ARRAY.negative;
    RECENT_VALUES_PER_SEC_ARRAY.score = (sumWithWeight/total).toFixed(2);
    document.getElementById("reactScorePerSec").innerHTML = RECENT_VALUES_PER_SEC_ARRAY.score;
}


function refreshEmojiByScore() {
    if (RECENT_VALUES_PER_SEC_ARRAY.score > 0.32) {
        document.getElementById("emojiByScorePerSec").src = "/static/imgs/emozi_positive.png";
    } else if (RECENT_VALUES_PER_SEC_ARRAY.score < -0.34) {
        document.getElementById("emojiByScorePerSec").src = "/static/imgs/emozi_negative.png";
    } else {
        document.getElementById("emojiByScorePerSec").src = "/static/imgs/emozi_neutral.png";
    }
}


function refreshReactNumPerSecBar(){
    reactNumPerSecBar.data.datasets[0].data = [
              RECENT_VALUES_PER_SEC_ARRAY.positive
            , RECENT_VALUES_PER_SEC_ARRAY.neutral
            , RECENT_VALUES_PER_SEC_ARRAY.negative
    ];
    reactNumPerSecBar.update();
}


function refreshReactScorePerSecTimeSeries(){
    reactScorePerSecTimeSeries.data.datasets[0].data = RECENT_VALUES_PER_SEC_ARRAY.scoreArray;
    reactScorePerSecTimeSeries.data.labels = RECENT_VALUES_PER_SEC_ARRAY.createdAtArray;
    reactScorePerSecTimeSeries.update();
}


let RECENT_VALUES_PER_SEC_ARRAY = {
      'positive': 0
    , 'neutral': 0
    , 'negative': 0
    , 'score': 0
    , 'scoreArray': []
    , 'createdAtArray': []
}


setInterval(function(){
    $.getJSON('/refresh_react_num_per_sec', {},
     function(data) {
        RECENT_VALUES_PER_SEC_ARRAY.positive = Number(data.positive);
        RECENT_VALUES_PER_SEC_ARRAY.neutral = Number(data.neutral);
        RECENT_VALUES_PER_SEC_ARRAY.negative = Number(data.negative);
        RECENT_VALUES_PER_SEC_ARRAY.createdAtArray = JSON.parse(data.createdAtArray);
        RECENT_VALUES_PER_SEC_ARRAY.scoreArray = JSON.parse(data.scoreArray);
});
    refreshReactNumPerSecBar();
    refreshScore();
    refreshEmojiByScore();
    refreshReactScorePerSecTimeSeries();
}, 1000);