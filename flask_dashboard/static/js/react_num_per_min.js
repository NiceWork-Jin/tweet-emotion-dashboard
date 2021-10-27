"use strict";

const reactNumPerMinDonutId = document.getElementById('reactNumPerMinDonut').getContext('2d');
const reactNumPerMinDonut = new Chart(reactNumPerMinDonutId, {
    type: 'doughnut',
    data: {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [{
            label: '',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)'
        ],
        }]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: '긍정, 중립, 부정 개수/분',
            },
            legend: {
                display: true
            }
        }
    }
});

function refreshReactNumPerMinDonut(){
    reactNumPerMinDonut.data.datasets[0].data = [RECENT_VALUES_PER_MIN_ARRAY.positive, RECENT_VALUES_PER_MIN_ARRAY.neutral, RECENT_VALUES_PER_MIN_ARRAY.negative];
    reactNumPerMinDonut.update();
}

let RECENT_VALUES_PER_MIN_ARRAY = {
      'positive': 0
    , 'neutral': 0
    , 'negative': 0
}

setInterval(function(){
    $.getJSON('/refresh_react_num_per_min', {},
     function(data) {
            RECENT_VALUES_PER_MIN_ARRAY.positive = data.positive;
            RECENT_VALUES_PER_MIN_ARRAY.neutral = data.neutral;
            RECENT_VALUES_PER_MIN_ARRAY.negative = data.negative;
        });
    refreshReactNumPerMinDonut();
}, 1000);