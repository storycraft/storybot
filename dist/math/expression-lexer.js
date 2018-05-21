"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _identifier = require("./type/identifier");

var _identifier2 = _interopRequireDefault(_identifier);

var _variable = require("./type/variable");

var _variable2 = _interopRequireDefault(_variable);

var _operator = require("./type/operator");

var _operator2 = _interopRequireDefault(_operator);

var _leftBracket = require("./type/left-bracket");

var _leftBracket2 = _interopRequireDefault(_leftBracket);

var _rightBracket = require("./type/right-bracket");

var _rightBracket2 = _interopRequireDefault(_rightBracket);

var _mathFunction = require("./type/math-function");

var _mathFunction2 = _interopRequireDefault(_mathFunction);

var _functionComma = require("./type/function-comma");

var _functionComma2 = _interopRequireDefault(_functionComma);

var _mathToken = require("./math-token");

var _mathToken2 = _interopRequireDefault(_mathToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ExpressionLexer {
    constructor() {
        this.currentPiece = null;
        this.currentToken = null;
        this.tokenList = [];
    }

    add(position, token) {
        if (this.Size <= position) throw new Error(`max size is ${this.Size} but adding to ${position}`);

        var nextToken = this.tokenList[position];
        var lastToken = this.tokenList[position - 1];

        this.tokenList.splice(position, 0, token);
    }

    remove(position) {
        if (this.Size <= position) throw new Error(`max size is ${this.Size} but remove at ${position}`);

        this.tokenList.splice(position, 1);

        var nextToken = this.tokenList[position];
        var lastToken = this.tokenList[position - 1];
    }

    push(token) {
        this.currentToken = token;
        this.tokenList.push(token);
    }

    get Size() {
        return this.tokenList.length;
    }

    get LastToken() {
        return this.currentToken;
    }

    parse(strExpression) {
        var length = strExpression.length;
        for (let i = 0; i < length; i++) {
            let chr = strExpression[i];
            let last = strExpression[i - 1];
            let next = strExpression[i + 1];

            var pieceFound = false;
            for (var piece of ExpressionLexer.PieceList) {
                if (piece.contains(chr, next, last)) {
                    if (!pieceFound) pieceFound = true;

                    if (this.currentPiece == piece && !this.currentPiece.IsSinglePiece) {
                        this.currentToken.Value += chr;
                    } else {
                        this.push(new _mathToken2.default(piece, chr));
                        this.currentPiece = piece;
                    }

                    break;
                }
            }

            if (!pieceFound) {
                throw new Error(`Error to parse ${chr} at ${this.Size}`);
            }
        }
    }

    forEach(func) {
        this.tokenList.forEach(func);
    }

    toString() {
        if (!this.currentToken) return "";

        var str = "";
        for (let token of this.tokenList) {
            str += token + ", ";
        }

        return str;
    }

    static get PieceList() {
        return ExpressionLexer.pieces;
    }
}

exports.default = ExpressionLexer;
ExpressionLexer.pieces = [new _identifier2.default(), new _mathFunction2.default(), new _functionComma2.default(), new _operator2.default(), new _variable2.default(), new _leftBracket2.default(), new _rightBracket2.default()];