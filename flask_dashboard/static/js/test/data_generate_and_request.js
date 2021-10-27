"use strict";

function reactNumberGenerator() {
    let positive_num = Math.floor(Math.random() * 51);
    let neutral_num = Math.floor(Math.random() * 51);
    let negative_num = Math.floor(Math.random() * 51);
    return {
        'positive_num': positive_num,
        'neutral_num': neutral_num,
        'negative_num': negative_num
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

