"use strict";

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

function refreshReactScoreTimeSeries(){
    reactScorePerSecTimeSeries.data.datasets[0].data = SCORE_TIME_SERIES_ARRAY.scoreArray;
    reactScorePerSecTimeSeries.data.labels = SCORE_TIME_SERIES_ARRAY.createdAtArray;
    reactScorePerSecTimeSeries.update();
}

let SCORE_TIME_SERIES_ARRAY = {"createdAtArray": [], "scoreArray": []}

setInterval(function(){
    $.getJSON('/get/sentiment_score_time_series', {},
     function(data) {
        SCORE_TIME_SERIES_ARRAY["createdAtArray"] = JSON.parse(data.createdAtArray);
        SCORE_TIME_SERIES_ARRAY["scoreArray"] = JSON.parse(data.scoreArray);
});
    refreshReactScoreTimeSeries();
}, 1000);