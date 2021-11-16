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

let RECENT_VALUES_PER_SEC_ARRAY = {
      'positive': 0
    , 'neutral': 0
    , 'negative': 0
}

function refreshReactNumPerSecBar(){
    reactNumPerSecBar.data.datasets[0].data = [
              RECENT_VALUES_PER_SEC_ARRAY.positive
            , RECENT_VALUES_PER_SEC_ARRAY.neutral
            , RECENT_VALUES_PER_SEC_ARRAY.negative
    ];
    reactNumPerSecBar.update();
}

setInterval(function(){
    $.getJSON('/get/sentiment_level_number/sec/1 ', {},
     function(data) {
        RECENT_VALUES_PER_SEC_ARRAY.positive = Number(data.positive);
        RECENT_VALUES_PER_SEC_ARRAY.neutral = Number(data.neutral);
        RECENT_VALUES_PER_SEC_ARRAY.negative = Number(data.negative);
});
    refreshReactNumPerSecBar();
}, 1000);