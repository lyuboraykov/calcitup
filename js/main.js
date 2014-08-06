(function () {
    "use strict";
    var currentTaskIndex = 0;
    var localPreloadedTasks = new Array(100); //searching in local is way faster than in the global scope

    var localMan;
    var localObstacle;

    var tryAgainImage, mainMenuImage;

    window.main = function () {
        var manifest = [
            { src: "images/manSpriteSheet.png", id: "runningManSprite" },
            { src: "images/landshaft.jpg", id: "background" },
            { src: "images/taskArea.jpg", id: "taskArea" },
            { src: "images/cloud.png", id: "cloud" },
            { src: "images/bird-sprite.png", id: "birdSprite" },
            { src: "images/sun.png", id: "sun" },
            { src: "music/Shake and Bake_0.mp3", id: "backgroundMusic" },
            { src: "music/jump.mp3", id: "jump" },
            { src: "images/try%20again.png", id: "tryAgainButton" },
            { src: "images/main%20menu.png", id: "mainMenuButton" },
            { src: "images/menuContainer.png", id: "menuContainer" },
        ];

        gameStates.preloader = new createjs.PreloadJS();
        gameStates.preloader.onComplete = init;
        gameStates.preloader.installPlugin(createjs.Sound);
        gameStates.preloader.loadManifest(manifest);

        var canvas = document.getElementById("game-stage-canvas");
        canvas.width = 1024;
        canvas.style.width = window.innerWidth + 'px';
        canvas.height = 576;
        canvas.style.height = window.innerHeight + 'px';
        gameStates.stage = new createjs.Stage(canvas);
    }

    var init = function () {
        gameStates.b2World = new box2dWeb.b2World(new box2dWeb.b2Vec2(0, 30), true);
        loadBackground(gameStates.preloader.getResult("background").result);
        loadMan(gameStates.preloader.getResult("runningManSprite").result)
        loadGround();
        loadSun();
        loadClouds(gameStates.preloader.getResult("cloud").result);
        loadBirds(gameStates.preloader.getResult("birdSprite").result);
        loadMenu();

        generatePreloadedTasks(100);
        localPreloadedTasks = gameStates.preloadedTasks;
        gameStates.stage.tick = gameLoop;
        gameStates.score = new createjs.Text("0", 'bold 30px Arial', '#000');
        gameStates.score.x = 472;
        gameStates.score.y = 30;
        gameStates.stage.addChild(gameStates.score);
        gameStates.stage.enableMouseOver(35);
        gameStates.task = new createjs.Text("0", 'bold 30px Arial', '#000');
        gameStates.task.y = 430;
        gameStates.task.x = 400;
        gameStates.stage.addChild(gameStates.task);
        loadNextTask();
        createjs.Ticker.setFPS(gameStates.FPS);
        createjs.Ticker.addListener(gameStates.stage);
        createjs.Ticker.useRAF = true;
        createjs.Sound.play("backgroundMusic");
        gameStates.stage.update();
    }

    var loadMenu = function () {
        gameStates.menuContainerImage = new createjs.Bitmap(gameStates.preloader.getResult("menuContainer").result);
        gameStates.menuContainerImage.scaleX = 0.48;
        gameStates.menuContainerImage.scaleY = 0.45;
        gameStates.menuContainerImage.y = -85;
        gameStates.menuContainerImage.x = 210;
        gameStates.stage.addChild(gameStates.menuContainerImage);
        var mainMenuImage = new createjs.Bitmap(gameStates.preloader.getResult("mainMenuButton").result);
        mainMenuImage.scaleX = 0.27;
        mainMenuImage.scaleY = 0.3;
        var tryAgainImage = new createjs.Bitmap(gameStates.preloader.getResult("tryAgainButton").result);
        tryAgainImage.scaleX = 0.27;
        tryAgainImage.scaleY = 0.3;
        gameStates.stage.addChild(mainMenuImage);
        mainMenuImage.x = 220;
        mainMenuImage.y = -65;
        mainMenuImage.onClick = function () {
            window.location.href = "index.html";
        };
        gameStates.stage.addChild(tryAgainImage);
        tryAgainImage.x = 560;
        tryAgainImage.y = -65;
        tryAgainImage.onClick = function () {
            gameStates.isRunning = false;
            localMan.gotoAndStop(6);
            gameStates.task.alpha = 255;
            gameStates.task.x = 350;
            createjs.Sound.stop();
            for (var i = 0; i < 4; i++) {
                gameStates.answers[i].alpha = 0;
                gameStates.answerShapes[i].alpha = 0;
            }
            for (var i = 0, length = gameStates.birds.length; i < length; i++) {
                gameStates.birds[i].onPress = null;
            }
            tryAgain();
            createjs.Tween.get(gameStates.menuContainerImage).to({ y: -85 }, 200);
            createjs.Tween.get(mainMenuImage).to({ y: -65 }, 200);
            createjs.Tween.get(tryAgainImage).to({ y: -65 }, 200);
        };
        gameStates.menuContainerImage.onClick = function () {
            if (localMan.x > -50) {
                if (gameStates.isRunning == true && localMan.x > -50) {
                    gameStates.isRunning = false;
                    createjs.Tween.get(gameStates.menuContainerImage).to({ y: 0 }, 200);
                    createjs.Tween.get(mainMenuImage).to({ y: 20 }, 200);
                    createjs.Tween.get(tryAgainImage).to({ y: 20 }, 200);
                    gameStates.task.alpha = 0;
                    for (var i = 0; i < 4; i++) {
                        gameStates.answers[i].alpha = 0;
                        gameStates.answerShapes[i].alpha = 0;
                    }
                }
                else {
                    gameStates.isRunning = true;
                    createjs.Tween.get(gameStates.menuContainerImage).to({ y: -85 }, 200);
                    createjs.Tween.get(mainMenuImage).to({ y: -65 }, 200);
                    createjs.Tween.get(tryAgainImage).to({ y: -65 }, 200);
                    gameStates.task.alpha = 255;
                    for (var i = 0; i < 4; i++) {
                        gameStates.answers[i].alpha = 255;
                        gameStates.answerShapes[i].alpha = 255;
                    }
                }
            }
        };
    }

    var loadSun = function () {
        gameStates.sun = new createjs.Bitmap(gameStates.preloader.getResult("sun").result);
        gameStates.stage.addChild(gameStates.sun);
        gameStates.sun.scaleX = 0.6;
        gameStates.sun.scaleY = 0.6;
        gameStates.sun.x = 70;
        gameStates.sun.y = 70;
        gameStates.sun.regX = 75;
        gameStates.sun.regY = 75;
        createjs.Tween.get(gameStates.sun, { loop: true }).to({ rotation: 10 }, 3000)
        .to({ rotation: -10 }, 3000);
        gameStates.sun.onClick = function () {
                createjs.Sound.setMute(createjs.Sound.getMute()^1);
        }
    }

    var loadBirds = function (birdImage) {
        var birdSpite = new createjs.SpriteSheet({
            images: [birdImage],
            frames: { height: 64, width: 64 },
            animations: { fly: [0, 3, "fly", 3] }
        });
        createjs.SpriteSheetUtils.addFlippedFrames(birdSpite, true, false, false);
        var birdsCount = 4;
        //initial position
        for (var i = 0; i < birdsCount; i++) {
            if (gameStates.birds[i] != null) {
                gameStates.stage.removeChild(gameStates.birds[i]);
            }
            var bird = new createjs.BitmapAnimation(birdSpite);
            bird.rotation = 24;
            bird.gotoAndPlay("fly");
            bird.scaleX = 0.8;
            bird.scaleY = 0.8;
            if (i > 0) {
                bird.x = (((Math.random() * 400) | 0)) + (gameStates.birds[i - 1].x / 5) | 0;
                bird.y = ((Math.random()) * 100) | 0 + 100;
            }
            else {
                bird.x = ((Math.random() * 400) | 0);
                bird.y = ((Math.random() * 100 + 100) | 0);
            }
            gameStates.birds[i] = bird;
            bird.onPress = shootBird;
        }

        for (var i = 0; i < birdsCount; i++) {
            gameStates.stage.addChild(gameStates.birds[i]);
        }
    }

    var shootBird = function (eventArgs) {
        var bird = eventArgs.target;
        var y = bird.y;
        var x = 1024 + localObstacle.x - bird.x;
        var tg = x / y;
        var angle = (Math.atan(tg) * 180 / Math.PI) | 0;
        bird.rotation = angle;
        setTimeout(function () {
            gameStates.stage.removeChild(bird);
        }, 300);

        createjs.Tween.get(bird)
            .to({ x: 1024 + localObstacle.x, y: 396 - gameStates.obstacleHeight / 2 }, 300)
            .call(function () {
                gameStates.b2World.DestroyBody(gameStates.b2Obstacle);
                loadNextTask();
            });
    }

    var loadClouds = function (cloudImage) {
        gameStates.cloudsCount = (Math.random() * 5) | 0 + 1;

        for (var i = 0; i < gameStates.cloudsCount; i++) {
            var cloud = new createjs.Bitmap(cloudImage);
            if (i > 0) {
                cloud.y = ((Math.random() * 40) | 0 + 10);
                cloud.x = (((Math.random() * 400) | 0) + 1024) + gameStates.clouds[i - 1].x / 5;
            }
            else {
                cloud.y = ((Math.random() * 40 + 10) | 0);
                cloud.x = ((Math.random() * 100) | 0 + 1024);
            }
            gameStates.clouds[i] = cloud;
        }
        for (var i = 0; i < gameStates.cloudsCount; i++) {
            gameStates.stage.addChild(gameStates.clouds[i]);
        }
    }

    window.loadObstacle = function (expression) {
        if (!localObstacle) {
            localObstacle = new createjs.Shape();
        }
        else {
            localObstacle.graphics.clear();
        }
        var obstacleG = localObstacle.graphics;
        obstacleG.beginFill("#000");
        var height = expression.obstacleHeight;
        var width = expression.obstacleWidth;
        gameStates.obstacleHeight = height;
        gameStates.obstacleWidth = width;
        obstacleG.drawRect(1024, 400 - height, width, height);
        gameStates.stage.addChild(localObstacle);
        gameStates.b2Obstacle = new createJsB2RectangularBody(gameStates.obstacleWidth, gameStates.obstacleHeight, 1024,
                                                        (400 - height) | 0, "kinematic", 1, 0.6, true, gameStates.b2World);
        var vector = new box2dWeb.b2Vec2(-gameStates.speed, 0);
        gameStates.b2Obstacle.SetLinearVelocity(vector, gameStates.b2Obstacle.GetPosition());
        gameStates.obstacle = localObstacle;
    }

    var loadBackground = function (backgroundImage) {
        gameStates.background = new createjs.Bitmap(backgroundImage);
        gameStates.background2 = new createjs.Bitmap(backgroundImage);
        gameStates.background2.x = gameStates.background.x + 1024;
        gameStates.stage.addChild(gameStates.background, gameStates.background2);

        var taskArea = new createjs.Bitmap(gameStates.preloader.getResult("taskArea").result);
        taskArea.x = 0;
        taskArea.y = 396;
        gameStates.stage.addChild(taskArea);
    }

    var loadMan = function (manImage) {
        var spriteSheet = new createjs.SpriteSheet({
            images: [manImage],
            frames: { width: 70, height: 108 },
            animations: { run: [0, 5, "run", 2], jump: [6, 11, "run", 4] }
        });
        createjs.SpriteSheetUtils.addFlippedFrames(spriteSheet, true, false, false);

        localMan = new createjs.BitmapAnimation(spriteSheet);
        localMan.gotoAndPlay("run");
        localMan.y = 300;
        localMan.x = 100;
        gameStates.stage.addChild(localMan);

        gameStates.b2Man = new createJsB2RectangularBody(50, 95, 100, 300, "dynamic", 0.7, 0.2, true, gameStates.b2World);
        var b2ManActor = new actor(localMan, gameStates.b2Man);
        gameStates.b2Actors[gameStates.b2Actors.length] = b2ManActor;
        gameStates.man = localMan;
    }

    var loadGround = function () {
        var groundY = gameStates.man.y + 96;
        gameStates.ground = new createjs.Shape();
        var g = gameStates.ground.graphics;
        g.beginFill("#000");
        g.drawRect(0, groundY, 1024, 8);
        gameStates.stage.addChild(gameStates.ground);

        var b2Ground = new createJsB2RectangularBody(1024, 8, 0, groundY, "static", 1, 0, true, gameStates.b2World);
    }

    var gameLoop = function () {
        if (gameStates.isRunning == true) {
            run();
            if ((localMan.x > (1024 + localObstacle.x - 130)
             && localMan.x < 1024 + localObstacle.x)
                        && gameStates.isAnsweredCorrect == true) {
                jump();
            }
            if (localObstacle.x < -1084) {
                gameStates.b2World.DestroyBody(gameStates.b2Obstacle);
                loadNextTask();
            }
        }

        if (localMan.x < -50) {
            gameStates.isRunning = false;
            localMan.gotoAndStop(6);
            gameStates.task.alpha = 255;
            gameStates.task.x = 350;
            gameStates.task.text = "Натиснете върху фона."
            createjs.Sound.stop();
            for (var i = 0; i < 4; i++) {
                gameStates.answers[i].alpha = 0;
                gameStates.answerShapes[i].alpha = 0;
            }
            gameStates.background.onPress = gameStates.background2.onPress = tryAgain;
            for (var i = 0, length = gameStates.birds.length; i < length; i++) {
                gameStates.birds[i].onPress = null;
            }
        }
        gameStates.stage.update();
    }

    var run = function () {
        gameStates.b2World.Step(1 / gameStates.FPS, 10, 10);

        for (var i = 0, length = gameStates.b2Actors.length; i < length; i++) {
            gameStates.b2Actors[i].update();
        }
        //take a deep breath and be calm
        localObstacle.x = gameStates.b2Obstacle.GetPosition().x * 30 - 1024 - (gameStates.obstacleWidth / 2) | 0;

        gameStates.background.x = (gameStates.background.x - (gameStates.speed / 5) | 0) % 1024;
        gameStates.background2.x = gameStates.background.x + 1024;
        gameStates.score.text = (parseInt(gameStates.score.text) + gameStates.speed) | 0;
        if (parseInt(gameStates.score.text) % 2000 <= gameStates.speed) {
            gameStates.speed += 0.5;
        }
        for (var i = 0, count = gameStates.cloudsCount; i < count; i++) {
            gameStates.clouds[i].x < -100 ? gameStates.clouds[i].x += 1024 :
            gameStates.clouds[i].x = gameStates.clouds[i].x - (gameStates.speed / 3) | 0;
        }
    }

    var jump = function () {
        localMan.gotoAndPlay("jump");
        gameStates.isAnsweredCorrect = false;
        var vectorY = -((gameStates.obstacleHeight + gameStates.obstacleWidth) / 1.8 | 0) - 17;
        var vector = new box2dWeb.b2Vec2(0, vectorY);
        gameStates.b2Man.ApplyImpulse(vector, gameStates.b2Man.GetPosition());
        createjs.Sound.play("jump");
    }

    window.loadNextTask = function () {
        currentTaskIndex = (currentTaskIndex + 1) % 100;//this should be the taskCount
        var currentTask = localPreloadedTasks[currentTaskIndex];
        if (currentTask.taskTypeString == "expression") {
            loadObstacle(currentTask.taskObject);
            drawExpression(currentTask.taskObject);
        }
        else {
            loadLabyrinth(currentTask.taskObject);
        }
    }

    var loadLabyrinth = function (labyrinth) {
        drawLabyrinth(gameStates.stage, labyrinth, 6, 385, 270, 0);
        rotateCamera();
    }

    window.tryAgain = function () {
        //save score
        if (!localStorage["scores"]) {

            var score = {
                points: parseInt(gameStates.score.text),
                name: localStorage["user"],
            };
            var scores = new Array(score);
            localStorage["scores"] = JSON.stringify(scores);
        }
        else {
            var scores = JSON.parse(localStorage["scores"]);
            scores.push({
                points: parseInt(gameStates.score.text),
                name: localStorage["user"],
            });
            localStorage["scores"] = JSON.stringify(scores);
        }
        //......................................

        gameStates.background.onPress = gameStates.background2.onPress = null;
        gameStates.task.x = 400;
        gameStates.score.text = "0";
        gameStates.speed = 8;
        localMan.gotoAndPlay("run");
        gameStates.b2Man = new createJsB2RectangularBody(50, 95, 100, 300, "dynamic", 0.7, 0.2, true, gameStates.b2World);
        gameStates.b2Actors[0] = new actor(localMan, gameStates.b2Man);
        gameStates.b2Actors[0].update();
        gameStates.isRunning = true;
        loadBirds(gameStates.preloader.getResult("birdSprite").result);
        gameStates.b2World.DestroyBody(gameStates.b2Obstacle);
        loadNextTask();
        createjs.Sound.play("backgroundMusic");
    }
})();