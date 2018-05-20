"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _expressionPiece = require("./expression-piece");

var _expressionPiece2 = _interopRequireDefault(_expressionPiece);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Operator extends _expressionPiece2.default {
    constructor() {
        super("OPERATOR");
    }

    isSinglePiece() {
        return true;
    }

    contains(chr) {
        return chr == "+" || chr == "-" || chr == "*" || chr == "/" || chr == "^";
    }
}
exports.default = Operator;