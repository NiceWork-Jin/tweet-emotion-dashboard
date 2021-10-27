"use strict";

let top5HashTagPerMinHorizBarId = document.getElementById('top5HashTagPerMinHorizBar').getContext('2d');
let top5HashTagPerMinHorizBar = new Chart(top5HashTagPerMinHorizBarId, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            data: [],
            fill: false,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
            ],
            borderWidth: 1
          }]
    },
    options: {
        indexAxis: 'y',
        plugins: {
            title: {
                display: true,
                text: '해시태그 탑 파이브',
            },
            legend: {
                display: false
            }
        }
    }
});

function refreshTop5HashTagPerMinHorizBar() {
    top5HashTagPerMinHorizBar.data.labels = RECENT_TOP_FIVE_ARRAY.labels;
    top5HashTagPerMinHorizBar.data.datasets[0].data = RECENT_TOP_FIVE_ARRAY.numberByLabel;
    top5HashTagPerMinHorizBar.update();
}

let RECENT_TOP_FIVE_ARRAY = {
      'labels': []
    , 'numberByLabel': []
}

setInterval(function(){
    $.getJSON('/refresh_top_five_hashtags_per_min', {
    }, function(data) {
        RECENT_TOP_FIVE_ARRAY.labels = Object.keys(data);
        RECENT_TOP_FIVE_ARRAY.numberByLabel = Object.values(data);
    });
    refreshTop5HashTagPerMinHorizBar();
}, 2000);