'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
class RPNConverter {
    constructor() {
        this.operandStack = [];
    }

    get OperandStack() {
        return this.operandStack;
    }

    convert(lexer) {
        var operandStack = [];
        var operatorStack = [];

        lexer.forEach(token => {
            if (token.Type.Name == 'IDENTIFIER' || token.Type.Name == 'VARIABLE') {
                operandStack.push(token);
            } else if (token.Type.Name == 'MATH_FUNCTION' || token.Type.Name == 'FUNCTION_COMMA' || token.Type.Name == 'LEFT_BRACKET') {
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

        return this.operandStack = operandStack;
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

    toString() {
        var str = '';

        for (let token of this.operandStack) {
            str += token.Value + ' ';
        }

        return str;
    }
}
exports.default = RPNConverter;