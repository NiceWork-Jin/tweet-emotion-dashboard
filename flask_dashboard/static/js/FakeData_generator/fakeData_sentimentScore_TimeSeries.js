"use strict";

let CREATED_AT_ARRAY = []
let SCORE_ARRAY = []

function scoreTimeSeries() {
//  get random number of each states
    let positive_num = Math.floor(Math.random() * 51);
    let neutral_num = Math.floor(Math.random() * 51);
    let negative_num = Math.floor(Math.random() * 51);

//  get Created_at
    let today = new Date();
    let time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

//  get average of positive/neutral/negative number
    let total = positive_num + neutral_num + negative_num;
    let sumWithWeight = (100 * positive_num) + (50 * neutral_num) + (0 * negative_num);
    let score = (sumWithWeight / total).toFixed(2);

//  Serve data maximum of 60 seconds
    if (CREATED_AT_ARRAY.length > 60) {
        CREATED_AT_ARRAY.shift()
        SCORE_ARRAY.shift()
    }
    CREATED_AT_ARRAY.push(time)
    SCORE_ARRAY.push(score)

    return {
        'createdAtArray': JSON.stringify(CREATED_AT_ARRAY),
        'scoreArray': JSON.stringify(SCORE_ARRAY),
    };
}

setInterval(function(){
     $.ajax({
        type: "POST"
      , url: "/update/sentiment_score_time_series"
      , data: scoreTimeSeries()
      , error:function(data){
            console.log('Error while sending to /update/sentiment_score_time_series')
        }
    });
}, 1000);