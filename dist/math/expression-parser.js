'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _expressionLexer = require('./expression-lexer');

var _expressionLexer2 = _interopRequireDefault(_expressionLexer);

var _expressionAnalyzer = require('./expression-analyzer');

var _expressionAnalyzer2 = _interopRequireDefault(_expressionAnalyzer);

var _tokenNode = require('./token-node');

var _tokenNode2 = _interopRequireDefault(_tokenNode);

var _mathExpression = require('./math-expression');

var _mathExpression2 = _interopRequireDefault(_mathExpression);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ExpressionParser {
    constructor() {
        this.lexer = new _expressionLexer2.default();
        this.analyzer = new _expressionAnalyzer2.default();

        this.rootNode;
    }

    get Lexer() {
        return this.lexer;
    }

    get Analyzer() {
        return this.analyzer;
    }

    parse(str) {
        this.Lexer.parse(str);
        this.analyzer.analysis(this.Lexer);

        return this.parseInternal();
    }

    parseInternal() {
        let rpnStack = this.convertToRPNInternal();

        var copy = rpnStack.slice(0);
        var expressionList = [];
        var stack = [];

        for (var token of copy) {
            if (token.Type.Name == 'IDENTIFIER') {
                stack.push(Number.parseFloat(token.Value));
            } else if (token.Type.Name == 'OPERATOR') {
                var rightValue = stack.pop();
                var leftValue = stack.pop();

                switch (token.Value) {
                    case '+':
                        stack.push(leftValue + rightValue);
                        break;

                    case '-':
                        stack.push(leftValue - rightValue);
                        break;

                    case '*':
                        stack.push(leftValue * rightValue);
                        break;

                    case '/':
                        stack.push(leftValue / rightValue);
                        break;

                    case '^':
                        stack.push(Math.pow(leftValue, rightValue));
                        break;
                }
            } else if (token.Type.Name == 'MATH_FUNCTION') {
                if (!Math[token.Value]) throw new Error(`${token.Value} is not found at javascript Math Object`);
                stack.push(Math[token.Value](stack.pop()));
            }
        }

        return stack[0];
    }

    convertToRPNInternal() {
        var operandStack = [];
        var operatorStack = [];

        this.Lexer.forEach(token => {
            if (token.Type.Name == 'IDENTIFIER') {
                operandStack.push(token);
            } else if (token.Type.Name == 'MATH_FUNCTION' || token.Type.Name == 'LEFT_BRACKET') {
                operatorStack.push(token);
            } else if (token.Type.Name == 'OPERATOR') {
                var priority = this.getOperatorPriority(token);
                var sideFlag = this.isOperatorLeftSide(token);

                while (operatorStack.length) {
                    var operatorToken = operatorStack[operatorStack.length - 1];

                    if (operatorToken.Type.Name == 'OPERATOR' && (priority <= this.getOperatorPriority(operatorToken) && sideFlag || !sideFlag && priority < this.getOperatorPriority(operatorToken)) && operatorToken.Type.Name != 'LEFT_BRACKET') {
                        operandStack.push(operatorStack.pop());
                    } else {
                        break;
                    }
                }

                operatorStack.push(token);
            } else if (token.Type.Name == 'RIGHT_BRACKET') {
                while (operatorStack.length) {
                    let operatorToken = operatorStack.pop();
                    if (operatorToken.Type.Name == 'LEFT_BRACKET') {
                        break;
                    } else {
                        operandStack.push(operatorToken);
                    }
                }
            }
        });

        for (let leftOperator of operatorStack) {
            operandStack.push(leftOperator);
        }

        return operandStack;
    }

    addToTreeInternal(token) {
        var node = new _tokenNode2.default(null, token);

        if (this.getPriority(node) > this.getPriority(this.rootNode)) {
            node.LeftNode = this.rootNode;
            this.rootNode = node;
        } else {
            node.LeftNode = this.rootNode.RightNode;
            this.rootNode.RightNode = node;
        }
    }

    getOperatorPriority(token) {
        switch (token.Value) {
            case '-':
            case '+':
                return 2;

            case '*':
            case '/':
                return 3;

            case '^':
                return 4;

            default:
                throw new Error('Unknown token type');
        }
    }

    isOperatorLeftSide(token) {
        switch (token.Value) {
            case '-':
            case '+':
            case '*':
            case '/':
                return true;

            case '^':
                return false;

            default:
                throw new Error('Unknown token type');
        }
    }

    //(2+(2-1)) -> 2/-\1 -> 2/+\2/-\1
}
exports.default = ExpressionParser;