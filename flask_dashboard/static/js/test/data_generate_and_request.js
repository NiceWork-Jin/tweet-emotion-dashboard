"use strict";

let CREATED_AT_ARRAY = []
let SCORE_ARRAY = []

function reactNumberGenerator() {
//  get random number of each states
    let positive_num = Math.floor(Math.random() * 51);
    let neutral_num = Math.floor(Math.random() * 51);
    let negative_num = Math.floor(Math.random() * 51);

//  get Created_at
    let today = new Date();
    let time = today.getHours().toString() + ':' + today.getMinutes() + ':' + today.getSeconds()

//  get average of positive/neutral/negative number
    const total = positive_num + neutral_num + negative_num;
    let sumWithWeight = (1 * positive_num) + (-1 * negative_num);
    let score = (sumWithWeight / total).toFixed(2);

//  Serve data maximum of 60 seconds
    if (CREATED_AT_ARRAY.length > 60) {
        CREATED_AT_ARRAY.shift()
        SCORE_ARRAY.shift()
    }
    CREATED_AT_ARRAY.push(time)
    SCORE_ARRAY.push(score)

    return {
        'positive_num': positive_num,
        'neutral_num': neutral_num,
        'negative_num': negative_num,
        'createdAtArray': JSON.stringify(CREATED_AT_ARRAY),
        'scoreArray': JSON.stringify(SCORE_ARRAY),
    };
}

function top5HashTagGenerator() {
    let labelAndNumberArray = {}
    let labelNumber = 0
    let number = 0
    for(let i=0; i < 6; i++) {
        labelNumber = 'hashTag' + Math.floor(Math.random() * 101);
        number = Math.floor(Math.random() * 101);
        labelAndNumberArray[labelNumber] = number;
    }
     return {'data': JSON.stringify(labelAndNumberArray)};
};


setInterval(function(){
     $.ajax({
        type: "POST"
      , url: "/update_react_num_per_sec"
      , data: reactNumberGenerator()
      , error:function(data){
            console.log('Error while sending to /update_react_num_per_sec')
        }
    });
}, 1000);

setInterval(function(){
     $.ajax({
        type: "POST"
      , url: "/update_react_num_per_min"
      , data: reactNumberGenerator()
      , error:function(data){
            console.log('Error while sending to /update_react_num_per_min')
        }
    });
}, 1000);

setInterval(function(){
     $.ajax({
        type: "POST"
      , url: "/update_top_five_hashtags_per_min"
      , data: top5HashTagGenerator()
      , error:function(data){
            console.log('Error while sending to /update_top_five_hashtags_per_min')
        }
    });
}, 1000);

