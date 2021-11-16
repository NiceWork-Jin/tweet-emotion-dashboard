"use strict";

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
      , url: "/update/top_five_hashtags/min/1"
      , data: top5HashTagGenerator()
      , error:function(data){
            console.log('Error while sending to /update/top_five_hashtags/min/1')
        }
    });
}, 1000);

