'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _expressionLexer = require('./expression-lexer');

var _expressionLexer2 = _interopRequireDefault(_expressionLexer);

var _expressionAnalyzer = require('./expression-analyzer');

var _expressionAnalyzer2 = _interopRequireDefault(_expressionAnalyzer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ExpressionParser {
    constructor() {
        this.lexer = new _expressionLexer2.default();
        this.analyzer = new _expressionAnalyzer2.default();
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
    }
}
exports.default = ExpressionParser;