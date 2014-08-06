(function () {
    var labyrinthSegment = function (upBool, rightBool, downBool, leftBool) {
        this.up = upBool;
        this.right = rightBool;
        this.down = downBool;
        this.left = leftBool;
        this.hasFourWalls = function () {
            if (this.up == false || this.right == false || this.down == false || this.left == false) {
                return false;
            }
            return true;
        }
    }

    window.generateLabyrinth = function (size) {
        var labyrinth = new Array(size);
        for (var i = 0; i < size; i++) {
            labyrinth[i] = new Array(size);
        }
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                labyrinth[i][j] = new labyrinthSegment(true, true, true, true);
            }
        }
        recursiveBacktrack(labyrinth, 0, 0, size);
        return labyrinth;
    }

    var recursiveBacktrack = function (labyrinth, indexRows, indexCols, size) {
        var directions = ['up', 'right', 'down', 'left'];
        directions.sort(randomOrder);
        for (var i = 0; i < 4; i++) {
            switch (directions[i]) {
                case 'up':
                    if (indexRows > 0 && labyrinth[indexRows - 1][indexCols].hasFourWalls()) {
                        breakWall(labyrinth, indexRows, indexCols, 'up');
                        recursiveBacktrack(labyrinth, indexRows - 1, indexCols, size);
                        break;
                    }
                case 'right':
                    if (indexCols < size - 1 && labyrinth[indexRows][indexCols + 1].hasFourWalls()) {
                        breakWall(labyrinth, indexRows, indexCols, 'right');
                        recursiveBacktrack(labyrinth, indexRows, indexCols + 1, size);
                        break;
                    }
                case 'down':
                    if (indexRows < size - 1 && labyrinth[indexRows + 1][indexCols].hasFourWalls()) {
                        breakWall(labyrinth, indexRows, indexCols, 'down');
                        recursiveBacktrack(labyrinth, indexRows + 1, indexCols, size);
                        break;
                    }
                case 'left':
                    if (indexCols > 0 && labyrinth[indexRows][indexCols - 1].hasFourWalls()) {
                        breakWall(labyrinth, indexRows, indexCols, 'left');
                        recursiveBacktrack(labyrinth, indexRows, indexCols - 1, size);
                        break;
                    }
            }
        }
        return;
    }

    var randomOrder = function () {
        return Math.random() - 0.5;
    }

    var breakWall = function (labyrinth, indexRows, indexCols, direction) {
        switch (direction) {
            case 'up':
                labyrinth[indexRows][indexCols].up = false;
                labyrinth[indexRows - 1][indexCols].down = false;
                break;
            case 'right':
                labyrinth[indexRows][indexCols].right = false;
                labyrinth[indexRows][indexCols + 1].left = false;
                break;
            case 'down':
                labyrinth[indexRows][indexCols].down = false;
                labyrinth[indexRows + 1][indexCols].up = false;
                break;
            case 'left':
                labyrinth[indexRows][indexCols].left = false;
                labyrinth[indexRows][indexCols - 1].right = false;
                break;
        }
    }
})();