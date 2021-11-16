"use strict";

function reactNumberMin() {
//  get random number of each states
    let positive = Math.floor(Math.random() * 51);
    let neutral = Math.floor(Math.random() * 51);
    let negative = Math.floor(Math.random() * 51);

    return {
        'positive': positive,
        'neutral': neutral,
        'negative': negative
    };
}

setInterval(function(){
     $.ajax({
        type: "POST"
      , url: "/update/sentiment_level_number/min/1"
      , data: reactNumberMin()
      , error:function(data){
            console.log('Error while sending to /update/sentiment_level_number/min/1');
        }
    });
}, 10000);