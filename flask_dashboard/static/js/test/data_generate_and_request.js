"use strict";

let CREATED_AT_SCORE_ARRAY = []
let CREATED_AT = []
let SCORE = []

function reactNumberGenerator() {
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

//  Save Created_at and average data into CREATED_AT_SCORE_ARRAY
    let createdAtAndScoreDict = {}
    createdAtAndScoreDict['x'] = time
    createdAtAndScoreDict['y'] = score

    if (CREATED_AT.length > 60) {
        CREATED_AT.shift()
        SCORE.shift()
        CREATED_AT_SCORE_ARRAY.shift()
    }

    CREATED_AT.push(time)
    SCORE.push(score)
    CREATED_AT_SCORE_ARRAY.push(createdAtAndScoreDict)
    return {
        'positive_num': positive_num,
        'neutral_num': neutral_num,
        'negative_num': negative_num,
        'createdAt': JSON.stringify(CREATED_AT),
        'score': JSON.stringify(SCORE),
        'createdAtAndScoreArray': JSON.stringify(CREATED_AT_SCORE_ARRAY)
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

