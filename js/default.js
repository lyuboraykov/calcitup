(function () {
    "use strict";
    var playButton = document.getElementById("play-button");

    playButton.onclick = function () {
        var nameInput = document.getElementById("name-input");
        var username = nameInput.value;
        if (username) {
            gameStates.user = username;
            localStorage["user"] = username;
        }
        else {
            localStorage["user"] = "Anonymous";
        }
    };
})();
