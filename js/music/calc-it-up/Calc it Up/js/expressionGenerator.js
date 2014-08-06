(function () {
    "use strict";
    window.Expression = function () {
        this.obstacleHeight = (Math.random() * 45) | 0 + 25;
        this.obstacleWidth = (Math.random() * 45) | 0 + 25;
        var obstacleSurface = this.obstacleHeight * this.obstacleWidth;
        var tokenCount = generateTokenCount(obstacleSurface);
        var numberStack = generateNumberStack(tokenCount);
        var operatorQueue = generateOperatorQueue(tokenCount);
        var cloneStack = new Array();
        var cloneQueue = new Array();
        for (var i = 0; i < tokenCount; i++) {
            cloneStack.push(numberStack[i]);
        }
        for (var i = 0; i < tokenCount - 1; i++) {
            cloneQueue.push(operatorQueue[i]);
        }
        var result = calculateResult(numberStack, operatorQueue);
        var infixTask = generateInfixTask(cloneStack, cloneQueue);
        var randomResults = generateRandomResults(result);
        this.infixTask = infixTask;
        this.answerIndex = (Math.random() * 4) | 0;
        randomResults.push(randomResults[this.answerIndex]);
        randomResults[this.answerIndex] = result;
        this.answers = randomResults;
    }

    var generateRandomResults = function (result) {
        var resultsRange = new Array(19);
        for (var i = result - 10; i < result + 10; i++) {
            resultsRange[i - (result - 10)] = i;
        }
        resultsRange.splice(10, 1);
        resultsRange.sort(randomOrder);
        var results = [resultsRange[0], resultsRange[1], resultsRange[2]];
        return results;
    }

    var randomOrder = function () {
        return 0.5 - Math.random();
    }

    var generateTokenCount = function (surface) {
        var tokens = 2;
        if (surface < 1400) {
            tokens = 2;
        }
        if (surface > 1400 && surface < 2600) {
            tokens = 3;
        }
        if (surface > 2600) {
            tokens = 4;
        }
        return tokens;
    }

    var generateNumberStack = function (tokenCount) {
        var numberStack = new Array();
        var currentNumber = 0;
        for (var i = 0; i < tokenCount; i++) {
            currentNumber = ((Math.random() * 5) | 0) + 1;
            numberStack.push(currentNumber);
        }
        return numberStack;
    }

    var generateOperatorQueue = function (tokenCount) {
        var operatorCount = tokenCount - 1;
        var operators = ['+', '-', '*'];
        var operatorQueue = new Array();
        var currentOperatorIndex = 0;
        for (var i = 0; i < operatorCount; i++) {
            currentOperatorIndex = (Math.random() * 3) | 0;
            operatorQueue.push(operators[currentOperatorIndex]);
        }
        return operatorQueue;
    }

    var calculateResult = function (numberStack, operatorQueue) {
        var currentResult = 0;
        var currentOperator;
        var operatorCount = operatorQueue.length;

        for (var i = 0; i < operatorCount; i++) {
            currentOperator = operatorQueue.splice(0, 1);
            if (currentOperator == "+") {
                currentResult = numberStack.pop() + numberStack.pop();
            }
            if (currentOperator == "-") {
                currentResult = numberStack.pop() - numberStack.pop();
            }
            if (currentOperator == "*") {
                currentResult = numberStack.pop() * numberStack.pop();
            }
            numberStack.push(currentResult);
        }
        return numberStack.pop();
    }

    var generateInfixTask = function (numberStack, operatorQueue) {
        var currentParenthesis = "";
        var expressionStack = numberStack;
        var currentOperator = "";
        var nextOperator = "";
        while (expressionStack.length > 1) {
            currentOperator = operatorQueue.splice(0, 1);
            nextOperator = operatorQueue.slice(0, 1);
            if ((currentOperator == "+" || currentOperator == "-") && (nextOperator != "+" && nextOperator != "-")) {
                currentParenthesis = "(" + expressionStack.pop() + " " + currentOperator + " " + expressionStack.pop() + ")";
            }
            else {
                currentParenthesis = expressionStack.pop() + " " + currentOperator + " " + expressionStack.pop() + "";
            }
            numberStack.push(currentParenthesis);
        }
        var expression = expressionStack.pop();
        if (expression[0] == "(" && expression[expression.length - 1] == ")") {
            return expression.slice(1, expression.length - 1);
        }
        return expression;
    }
})();