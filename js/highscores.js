(function () {
    var scoresList = document.getElementById("highscores-list")
    if (!localStorage["scores"]) {
        scoresList.innerHTML = "";
        var listItem = document.createElement("li");
        listItem.innerText = "Няма резултати";
        scoresList.appendChild(listItem);
    }
    else {
        scoresList.innerHTML = "";
        var scores = JSON.parse(localStorage["scores"]);
        scores.sort(compareScores);
        var topScores = scores.splice(0, 5);
        for (var i = 0, length = topScores.length; i < length; i++) {
            var scoreItem = document.createElement("li");
            scoreItem.innerHTML = topScores[i].name + " - " + topScores[i].points;
            scoresList.appendChild(scoreItem);
        }
    }

    function compareScores(a, b) {
        if (a.points < b.points) {
            return 1;
        }
        if (a.points == b.points) {
            return 0;
        }
        return -1;
    }
})();
