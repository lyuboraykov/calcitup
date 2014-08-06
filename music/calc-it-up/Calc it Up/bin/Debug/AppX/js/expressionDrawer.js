(function () {
    "use strict";
    window.drawExpression = function (expression) {
        gameStates.task.alpha = 255;
        gameStates.task.text = expression.infixTask + " = ?";

        for (var i = 0; i < 4; i++) {
            gameStates.stage.removeChild(gameStates.answers[i]);
            gameStates.stage.removeChild(gameStates.answerShapes[i]);
        }
        var x = 250;
        for (var i = 0; i < 4; i++) {
            x += 100;
            if (gameStates.answerShapes[i]) {
                gameStates.answerShapes[i].graphics.clear();
            }
            gameStates.answerShapes[i] = new createjs.Shape();
            var answerShapeG = gameStates.answerShapes[i].graphics;
            answerShapeG.beginFill("#CECECE");
            answerShapeG.drawCircle(x + 20, 510, 30); //x y r
            gameStates.stage.addChild(gameStates.answerShapes[i]);
            gameStates.answers[i] = new createjs.Text("0", 'bold 30px Arial', '#000');
            gameStates.stage.addChild(gameStates.answers[i]);
            gameStates.answerShapes[i].onClick = null;
            gameStates.answers[i].text = expression.answers[i];
            if (signsCount(expression.answers[i]) == 2) { // 2 signs
                gameStates.answers[i].x = x + 3;
            }
            if (signsCount(expression.answers[i]) == 3) {// 3 signs
                gameStates.answers[i].x = x - 5;
            }
            if (signsCount(expression.answers[i]) == 1) { // 1 sign
                gameStates.answers[i].x = x + 10;
            }
            gameStates.answerShapes[i].shadow = new createjs.Shadow("#9a9a9a", 2, 2);
            gameStates.answers[i].y = 490;
            gameStates.answers[i].onClick = null;
            if (i == expression.answerIndex) {
                gameStates.answers[i].onClick = answeredCorrect;
                gameStates.answerShapes[i].onClick = answeredCorrect;
            }
            else {
                gameStates.answers[i].onClick = answeredWrong;
                gameStates.answerShapes[i].onClick = answeredWrong;
            }
        }
    }

    var signsCount = function (number) {
        var signsCountInt = 1;
        if ((number > 9 && number < 100)
                || (number < 0 && number > -10)) {
            signsCountInt = 2;
        }
        if (number > 99 || number < -9) {
            signsCountInt = 3;
        }
        return signsCountInt;
    }

    window.newExpression = function (obstacleSurface) {
        var expression = new Expression(obstacleSurface);
        drawExpression(expression);
    }

    var answeredCorrect = function () {
        gameStates.isAnsweredCorrect = true;
        createjs.Tween.get(gameStates.task).to({ alpha: 0 }, 300);
        for (var i = 0; i < 4; i++) {
            createjs.Tween.get(gameStates.answers[i]).to({ alpha: 0 }, 300);
            createjs.Tween.get(gameStates.answerShapes[i]).to({ alpha: 0 }, 300);
        }
    }

    var answeredWrong = function () {
        createjs.Tween.get(gameStates.task).to({ alpha: 0 }, 300);
        for (var i = 0; i < 4; i++) {
            createjs.Tween.get(gameStates.answers[i]).to({ alpha: 0 }, 300);
            createjs.Tween.get(gameStates.answerShapes[i]).to({ alpha: 0 }, 300);
        }
    }
})();