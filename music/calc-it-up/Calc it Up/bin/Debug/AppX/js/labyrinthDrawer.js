var labyrinthStates = {
    isBeginningPressed: false,
    beginning: [0, 0],
    end: [5, 0],
    labyrinthSegmentIndexes: new Array(),
    isSegmentClicked: false,
    lastEnteredSegment: [null, null],
    labyrinthArray: null,
    blockWidth: 0,
    x: 0,
    y: 0,
    segmentsCount: 0,
    walls: null,
    isLabyrinthPassed: false,
    manFromTop: null,
    labyrinthTimer: null,
    labyrinthSeconds: 0,
};
(function () {
    "use strict";
    window.drawLabyrinth = function (stage, labyrinth, segmentsCount, width, positionX, positionY) {
        labyrinthStates.blockWidth = width / segmentsCount;
        labyrinthStates.x = positionX;
        labyrinthStates.y = positionY;
        labyrinthStates.segmentsCount = segmentsCount;
        labyrinthStates.labyrinthSegmentIndexes = new Array(segmentsCount);
        labyrinthStates.isLabyrinthPassed = false;

        labyrinthStates.beginning[0] = (Math.random() * labyrinthStates.segmentsCount) | 0;
        labyrinthStates.end[1] = labyrinthStates.segmentsCount - 1;
        labyrinthStates.end[0] = (Math.random() * labyrinthStates.segmentsCount) | 0;
        drawWalls(labyrinth, stage);
        labyrinthStates.labyrinthArray = labyrinth;
    }

    var drawWalls = function (labyrinth, stage) {
        labyrinthStates.walls = new createjs.Shape();
        var wallsg = labyrinthStates.walls.graphics;
        wallsg.beginFill("#000");
        var width = (labyrinthStates.blockWidth) | 0;
        var thickness = (width / 4) | 0;
        var size = labyrinthStates.segmentsCount;
        var x = labyrinthStates.x;
        var y = labyrinthStates.y;
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (labyrinth[i][j].up == true) {
                    wallsg.drawRect(x + j * width, y + i * width, width, thickness);//x, y, w, h
                }
                if (labyrinth[i][j].left == true) {
                    wallsg.drawRect(x + j * width, y + i * width, thickness, width);
                }
                if (labyrinth[i][j].right == true && !(j == size - 1 && i == size - 1 - labyrinthStates.beginning[0])) {//the labyrinth rotates
                    wallsg.drawRect(x + (j + 1) * width, y + i * width, thickness, width);
                }
                if (labyrinth[i][j].down == true) {
                    wallsg.drawRect(x + j * width, y + (i + 1) * width, width, thickness);
                }
            }
        }
        labyrinthStates.walls.rotation = -180;
        labyrinthStates.walls.x += 2 * x + (size * width) + thickness;
        labyrinthStates.walls.y += 2 * y + (size * width) + thickness;
        labyrinthStates.walls.skewX = 90;
        stage.addChild(labyrinthStates.walls);
    }

    window.drawLabyrinthSegments = function (stage) {
        var width = (labyrinthStates.blockWidth) | 0;
        var thickness = (width / 4) | 0;
        var size = labyrinthStates.segmentsCount;
        var x = labyrinthStates.x;
        var y = labyrinthStates.y;
        for (var i = 0; i < size; i++) {
            labyrinthStates.labyrinthSegmentIndexes[i] = new Array(size);
            for (var j = 0; j < size; j++) {
                var labyrinthSegment = new createjs.Shape();
                labyrinthSegment.graphics.beginFill("#dcdcdc");
                labyrinthSegment.graphics.drawRect(x + j * width + thickness, y + i * width + thickness,
                                                            width - 1.2 * thickness, width - 1.2 * thickness);
                labyrinthSegment.name = i + ' ' + j;
                if (i == labyrinthStates.beginning[0] && j == labyrinthStates.beginning[1]) {
                    labyrinthSegment.onPress = beginningPressed;
                    labyrinthSegment.graphics.beginFill("#dcdcdc");
                    labyrinthSegment.graphics.drawRect(x + j * width + thickness, y + i * width + thickness,
                                                            width - 1.2 * thickness, width - 1.2 * thickness);
                }
                else if (i == labyrinthStates.end[0] && j == labyrinthStates.end[1]) {
                    labyrinthSegment.onMouseOver = endOnMouseOver;
                    labyrinthSegment.graphics.beginFill("#0F0");
                    labyrinthSegment.graphics.drawRect(x + j * width + thickness, y + i * width + thickness,
                                                            width - 1.2 * thickness, width - 1.2 * thickness);
                }
                else {
                    labyrinthSegment.onPress = segmentPressed;
                    labyrinthSegment.onMouseOver = segmentOnMouseOver;
                }
                stage.addChild(labyrinthSegment);
                labyrinthStates.labyrinthSegmentIndexes[i][j] = stage.getChildIndex(labyrinthSegment);
            }
        }
    }

    var segmentPressed = function (eventArgs) {
        selectElement(eventArgs);
        labyrinthStates.isBeginningPressed = false;
        labyrinthStates.isSegmentClicked = true;
        labyrinthStates.lastEnteredSegment = parseStringArray(eventArgs.target.name.split(' '));
        eventArgs.onMouseUp = function () {
            if (!labyrinthStates.isLabyrinthPassed) {
                labyrinthStates.isSegmentClicked = false;
                clearLabyrinth(gameStates.stage);
            }
        }
    }

    var segmentOnMouseOver = function (eventArgs) {
        var selectedSegment = eventArgs.target;
        var coordinates = parseStringArray(selectedSegment.name.split(' '));
        if (labyrinthStates.isSegmentClicked && !isWallBetween(labyrinthStates.lastEnteredSegment, coordinates)) {
            labyrinthStates.lastEnteredSegment = coordinates;
            labyrinthStates.isSegmentClicked = true;
            selectElement(eventArgs);
        }
    }

    var isWallBetween = function (segment1Coordinates, segment2Coordinates) {
        var labyrinth = labyrinthStates.labyrinthArray;
        var r1 = segment1Coordinates[0];
        var c1 = segment1Coordinates[1];
        var r2 = segment2Coordinates[0];
        var c2 = segment2Coordinates[1];
        var size = labyrinthStates.segmentsCount;
        if (r1 - r2 > 1 || r2 - r1 > 1 || c1 - c2 > 1 || c2 - c1 > 1 || (r1 - r2 == 1 && c1 - c2 == 1)
            || (r1 - r2 == 1 && c1 - c2 == -1) || (r1 - r2 == -1 && c1 - c2 == 1) || (r1 - r2 == -1 && c1 - c2 == -1)) {
            return true;
        }
        if (r1 == r2) {
            //user going left
            if (c1 > c2 && labyrinth[size - r1 - 1][size - c1 - 1].right == true) {
                return true;
            }
            //user going right
            if (c1 < c2 && labyrinth[size - r2 - 1][size - c2 - 1].right == true) {
                return true;
            }
        }
        if (c1 == c2) {
            //user going up
            if (r1 > r2 && labyrinth[size - r1 - 1][size - c1 - 1].down == true) {
                return true;
            }
            //user going down
            if (r1 < r2 && labyrinth[size - r2 - 1][size - c2 - 1].down == true) {
                return true;
            }
        }
        return false;
    }

    var beginningPressed = function (eventArgs) {
        selectElement(eventArgs);
        labyrinthStates.isBeginningPressed = true;
        labyrinthStates.isSegmentClicked = true;
        labyrinthStates.lastEnteredSegment = parseStringArray(eventArgs.target.name.split(' '));
        eventArgs.onMouseUp = function () {
            labyrinthStates.isSegmentClicked = false;
            labyrinthStates.isBeginningPressed = false;
            if (!labyrinthStates.isLabyrinthPassed) {
                clearLabyrinth(gameStates.stage);
            }
        }
    }

    var endOnMouseOver = function (eventArgs) {
        var selectedSegment = eventArgs.target;
        var coordinates = parseStringArray(selectedSegment.name.split(' '));
        if (labyrinthStates.isBeginningPressed && labyrinthStates.isSegmentClicked
                    && !isWallBetween(labyrinthStates.lastEnteredSegment, coordinates)) {
            labyrinthStates.isSegmentClicked = false;
            labyrinthStates.isBeginningPressed = false;
            labyrinthStates.isLabyrinthPassed = true;
            removeLabyrinth(gameStates.stage);
        }
    }

    var clearLabyrinth = function (stage) {
        var width = (labyrinthStates.blockWidth) | 0;
        var thickness = (width / 4) | 0;
        var size = labyrinthStates.segmentsCount;
        var x = labyrinthStates.x;
        var y = labyrinthStates.y;
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                var index = labyrinthStates.labyrinthSegmentIndexes[i][j];
                var segment = stage.getChildAt(index);
                if ((i != labyrinthStates.beginning[0] || j != labyrinthStates.beginning[1]) &&
                    (i != labyrinthStates.end[0] || j != labyrinthStates.end[1])) {
                    var coordinates = parseStringArray(segment.name.split(' '));
                    segment.graphics
                    .clear()
                    .beginFill("#dcdcdc")
                    .drawRect(x + coordinates[1] * width + thickness, y + coordinates[0] * width + thickness,
                                                            width - 1.2 * thickness, width - 1.2 * thickness);
                }
            }
        }
    }

    var selectElement = function (elementEventArgs) {
        var width = (labyrinthStates.blockWidth) | 0;
        var thickness = (width / 4) | 0;
        var size = labyrinthStates.segmentsCount;
        var x = labyrinthStates.x;
        var y = labyrinthStates.y;
        var selectedSegment = elementEventArgs.target;
        var coordinates = parseStringArray(selectedSegment.name.split(' '));
        selectedSegment.graphics
        .clear()
        .beginFill("#8cf4ed")
        .drawRect(x + coordinates[1] * width + thickness, y + coordinates[0] * width + thickness,
                                                            width - 1.2 * thickness, width - 1.2 * thickness);
    }

    var parseStringArray = function (stringArray) {
        var intArray = new Array(stringArray.length);
        for (var i = 0; i < stringArray.length; i++) {
            intArray[i] = parseInt(stringArray[i]);
        }
        return intArray;
    }

    var arrayEquals = function (arrac1, arrac2) {
        var areEqual = false;
        if (arrac1.length == arrac2.length) {
            areEqual = true;
            for (var i = 0; i < arrac1.length; i++) {
                if (arrac1[i] != arrac2[i]) {
                    areEqual = false;
                }
            }
        }
        return areEqual;
    }

    var removeLabyrinth = function (stage) {
        clearInterval(labyrinthStates.labyrinthTimer);
        var walls = labyrinthStates.walls;
        //this is where the magic happens
        gameStates.isRunning = true;
        gameStates.man.gotoAndPlay('run');
        gameStates.score.alpha = 255;
        gameStates.obstacle.alpha = 255;
        //removeSegments
        var beginningIndex = labyrinthStates.labyrinthSegmentIndexes[0][0];
        var size = labyrinthStates.segmentsCount;
        var endingIndex = labyrinthStates.labyrinthSegmentIndexes[size - 1][size - 1];
        for (var i = beginningIndex; i <= endingIndex; i++) {
            stage.removeChildAt(beginningIndex);
        }
        stage.removeChild(labyrinthStates.manFromTop);
        //........................
        for (var i = 0, length = gameStates.cloudsCount; i < length; i++) {
            gameStates.clouds[i].alpha = 255;
        }
        for (var i = 0, length = gameStates.birds.length; i < length; i++) {
            gameStates.birds[i].alpha = 255;
        }
        createjs.Tween.get(gameStates.man).to({ skewX: 0 }, 500);
        createjs.Tween.get(walls).to({ skewX: 90 }, 500).call(function () {
            stage.removeChild(labyrinthStates.walls);
        });
        createjs.Tween.get(gameStates.background2).to({ skewX: 0 }, 500);
        createjs.Tween.get(gameStates.background).to({ skewX: 0 }, 500);
        gameStates.b2World.DestroyBody(gameStates.b2Obstacle);
        gameStates.sun.alpha = 255;
        loadNextTask();
    }

    window.rotateCamera = function () {
        var walls = labyrinthStates.walls;
        //this is where the magic happens
        gameStates.isRunning = false;
        gameStates.man.gotoAndStop(6);
        labyrinthStates.manFromTop = new createjs.Shape();
        labyrinthStates.manFromTop.graphics.beginFill("#000");
        var manFromTopY = labyrinthStates.beginning[0] * labyrinthStates.blockWidth + labyrinthStates.y + 45;
        labyrinthStates.manFromTop.graphics.drawCircle(100, manFromTopY, 20);
        labyrinthStates.manFromTop.scaleX = 0;
        gameStates.stage.addChild(labyrinthStates.manFromTop);
        gameStates.score.alpha = 0;
        gameStates.sun.alpha = 0;
        gameStates.obstacle.alpha = 0;
        for (var i = 0, length = gameStates.cloudsCount; i < length; i++) {
            gameStates.clouds[i].alpha = 0;
        }
        for (var i = 0, length = gameStates.birds.length; i < length; i++) {
            gameStates.birds[i].alpha = 0;
        }
        for (var i = 0; i < 4; i++) {
            gameStates.answers[i].alpha = 0;
            gameStates.answerShapes[i].alpha = 0;
        }
        createjs.Tween.get(gameStates.man).to({ skewX: 90, y: manFromTopY }, 500);
        createjs.Tween.get(labyrinthStates.manFromTop).to({ scaleX: 1 }, 500).call(function () {
            createjs.Tween.get(labyrinthStates.manFromTop).to({ x: 170 }, 1000);
        });
        createjs.Tween.get(walls).to({ skewX: 0 }, 500);
        createjs.Tween.get(gameStates.background2).to({ skewX: -100 }, 500);
        createjs.Tween.get(gameStates.background).to({ skewX: -100 }, 500)
            .call(function () { //this executes after the animation
                drawLabyrinthSegments(gameStates.stage);
            });
        gameStates.task.alpha = 255;
        labyrinthStates.labyrinthSeconds = 10;
        gameStates.task.text = labyrinthStates.labyrinthSeconds.toString();
        gameStates.obstacle.graphics.clear();
        for (var i = 0; i < 4; i++) {
            gameStates.answerShapes[i].graphics.clear();
            gameStates.answers[i].text = "";
        }
        labyrinthStates.labyrinthTimer = setInterval(timeOutLabyrinth, 1000);
    }

    var timeOutLabyrinth = function () {
        labyrinthStates.labyrinthSeconds--;
        gameStates.task.text = labyrinthStates.labyrinthSeconds.toString();
        if (labyrinthStates.labyrinthSeconds == 0) {
            removeLabyrinth(gameStates.stage);
            gameStates.isRunning = false;
            gameStates.man.gotoAndStop(6);
            gameStates.task.alpha = 255;
            gameStates.task.text = "Tap on the background."
            gameStates.man.alpha = 0;
            gameStates.obstacle.alpha = 255;
            for (var i = 0; i < 4; i++) {
                gameStates.answerShapes[i].alpha = 0;
                gameStates.answers[i].alpha = 0;
            }
            createjs.Sound.stop();
            gameStates.background.onPress = gameStates.background2.onPress = function () {
                tryAgain();
                gameStates.man.alpha = 255;
            }
            for (var i = 0, length = gameStates.birds.length; i < length; i++) {
                gameStates.birds[i].onPress = null;
            }
        }
    }
})();