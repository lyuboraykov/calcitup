(function () {
    "use strict";
    window.generatePreloadedTasks = function (taskCount) {
        gameStates.preloadedTasks = new Array(taskCount);
        var lastTaskType = "";
        for (var i = 0; i < taskCount; i++) {
            var taskType = randomTaskType();
            if (taskType == 'expression' || lastTaskType == "labyrinth" || i == 1) {
                gameStates.preloadedTasks[i] = new Task("expression", new Expression());
                lastTaskType = 'expression';
            }
            else {
                gameStates.preloadedTasks[i] = new Task("labyrinth", generateLabyrinth(6));
                lastTaskType = 'labyrinth';
            }
        }
    }

    var Task = function (taskTypeString, taskObject) {
        this.taskTypeString = taskTypeString;
        this.taskObject = taskObject;
    }

    var randomTaskType = function () {
        var number = (Math.random() * 4) | 0
        if (number == 3) {
            return 'labyrinth';
        }
        return 'expression';
    }
})();