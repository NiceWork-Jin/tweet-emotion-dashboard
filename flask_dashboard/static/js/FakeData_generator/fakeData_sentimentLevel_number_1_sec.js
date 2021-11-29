"use strict";

function reactNumberSec() {
//  get random number of each states
    let positive = Math.floor(Math.random() * 5);
    let neutral = Math.floor(Math.random() * 5);
    let negative = Math.floor(Math.random() * 5);

    return {
        'positive': positive,
        'neutral': neutral,
        'negative': negative,
    };
}

setInterval(function(){
     $.ajax({
        type: "POST"
      , url: "/update/sentiment_level_number/sec/1"
      , data: reactNumberSec()
      , error:function(data){
            console.log('Error while sending to /update/sentiment_level_number/sec/1')
        }
    });
}, 1000);

