"use strict";

function refreshScore(){
    const total = RECENT_VALUES_PER_SEC_ARRAY.positive * 100 + RECENT_VALUES_PER_SEC_ARRAY.neutral * 50 + RECENT_VALUES_PER_SEC_ARRAY.negative * 0;
    RECENT_VALUES_PER_SEC_ARRAY.score = (total/(RECENT_VALUES_PER_SEC_ARRAY.positive + RECENT_VALUES_PER_SEC_ARRAY.neutral + RECENT_VALUES_PER_SEC_ARRAY.negative)).toFixed(2);
    document.getElementById("reactScorePerSec").innerHTML = RECENT_VALUES_PER_SEC_ARRAY.score;
}

function refreshEmojiByScore() {
    if (RECENT_VALUES_PER_SEC_ARRAY.score >= 66) {
        document.getElementById("emojiByScorePerSec").src = "/static/imgs/emozi_positive.png";
    } else if (RECENT_VALUES_PER_SEC_ARRAY.score <= 33) {
        document.getElementById("emojiByScorePerSec").src = "/static/imgs/emozi_negative.png";
    } else {
        document.getElementById("emojiByScorePerSec").src = "/static/imgs/emozi_neutral.png";
    }
}

let SCORE = 0

setInterval(function(){
    refreshScore()
    refreshEmojiByScore();
}, 1000);