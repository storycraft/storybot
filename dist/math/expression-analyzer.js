'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
class ExpressionAnalyzer {
    constructor() {
        this.variableList = [];
    }

    get VariableList() {
        return this.variableList;
    }

    analysis(lexer) {
        var bracketCount = 0;
        lexer.forEach(token => {
            if (token.Type.Name == 'LEFT_BRACKET') bracketCount++;else if (token.Type.Name == 'RIGHT_BRACKET') bracketCount--;else if (token.Type.Name == 'IDENTIFIER' && isNaN(Number.parseFloat(token.Value))) throw new Error(`${token.Value} is not a number`);else if (token.Type.Name == 'LEFT_BRACKET' && token.NextToken.Type.Name != 'RIGHT_BRACKET') throw new Error('brackets cannot be used without operator');else if (token.Type.Name == 'VARIABLE') {
                this.variableList.push(token.Value);
            }

            if (token.PreviousToken) {
                if (token.Type.Name == 'OPERATOR' && token.PreviousToken.Type.Name == 'OPERATOR') throw new Error(`Operators cannot be used multiple times at one time`);
            } else if (token.NextToken) {
                if (token.Type.Name == 'MATH_FUNCTION' && token.NextToken.Type.Name != 'LEFT_BRACKET') throw new Error(`Functions cannot be used without bracket`);else if (token.Type.Name == 'LEFT_BRACKET' && token.NextToken.Type.Name != 'IDENTIFIER' || token.Type.Name == 'RIGHT_BRACKET' && token.NextToken.Type.Name != 'OPERATOR') throw new Error(`Number should come after left bracket and operator should come after right bracket`);
            }
        });

        if (bracketCount != 0) new Error(`Bracket count is not matching`);
    }
}
exports.default = ExpressionAnalyzer;