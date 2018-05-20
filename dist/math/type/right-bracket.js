"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _expressionPiece = require("./expression-piece");

var _expressionPiece2 = _interopRequireDefault(_expressionPiece);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RightBracket extends _expressionPiece2.default {
    constructor() {
        super("RIGHT_BRACKET");
    }

    get IsSinglePiece() {
        return true;
    }

    contains(chr) {
        return chr == ")";
    }
}
exports.default = RightBracket;