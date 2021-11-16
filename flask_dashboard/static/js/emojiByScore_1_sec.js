"use strict";

function refreshScore(){
    const total = RECENT_VALUES_PER_SEC_ARRAY.positive + RECENT_VALUES_PER_SEC_ARRAY.neutral + RECENT_VALUES_PER_SEC_ARRAY.negative;
    let sumWithWeight = 1 * RECENT_VALUES_PER_SEC_ARRAY.positive + -1 * RECENT_VALUES_PER_SEC_ARRAY.negative;
    RECENT_VALUES_PER_SEC_ARRAY.score = (sumWithWeight/total).toFixed(2);
    document.getElementById("reactScorePerSec").innerHTML = RECENT_VALUES_PER_SEC_ARRAY.score;
}

function refreshEmojiByScore() {
    if (RECENT_VALUES_PER_SEC_ARRAY.score > 0.32) {
        document.getElementById("emojiByScorePerSec").src = "/static/imgs/emozi_positive.png";
    } else if (RECENT_VALUES_PER_SEC_ARRAY.score < -0.34) {
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