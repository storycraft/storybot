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

var _rpnConverter = require('./rpn-converter');

var _rpnConverter2 = _interopRequireDefault(_rpnConverter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ExpressionParser {
    constructor() {
        this.lexer = new _expressionLexer2.default();
        this.analyzer = new _expressionAnalyzer2.default();
        this.converter = new _rpnConverter2.default(this);

        this.variableMap = new Map();

        this.rootNode;
    }

    get Lexer() {
        return this.lexer;
    }

    get Analyzer() {
        return this.analyzer;
    }

    get Converter() {
        return this.converter;
    }

    get VariableMap() {
        return this.variableMap;
    }

    parse(str, variableMap = new Map()) {
        this.variableMap = variableMap;

        this.Lexer.parse(str);
        this.Analyzer.analysis(this.Lexer);
        this.Converter.convert(this.Lexer);
    }

    calculate() {
        let rpnStack = this.Converter.OperandStack;

        var expressionList = [];
        var stack = [];

        for (var token of rpnStack) {
            if (token.Type.Name == 'IDENTIFIER') {
                stack.push(Number.parseFloat(token.Value));
            } else if (token.Type.Name == 'VARIABLE') {
                stack.push(this.getVariableValue(token));
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

                var func = Math[token.Value];

                if (!func) throw new Error(`${token.Value} is not found at javascript Math Object`);

                let valueList = [];

                let index = rpnStack.indexOf(token);
                let count = 0;
                while (rpnStack[--index].Type.Name == 'FUNCTION_COMMA') {
                    count++;
                }

                for (let i = 0; i <= count; i++) {
                    valueList.push(stack.pop());
                }

                if (func.length != valueList.length) throw new Error(`Required arguments: ${func.length} but provided ${valueList.length}`);

                stack.push(func.apply(null, valueList.reverse()));
            }
        }

        return stack[0];
    }

    getVariableValue(token) {
        if (token.Type.Name == 'VARIABLE' && this.VariableMap.has(token.Value)) return Number.parseFloat(this.VariableMap.get(token.Value));

        throw new Error(`Variable ${token.Value} is not set`);
    }
}
exports.default = ExpressionParser;