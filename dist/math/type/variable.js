"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _expressionPiece = require("./expression-piece");

var _expressionPiece2 = _interopRequireDefault(_expressionPiece);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Variable extends _expressionPiece2.default {
    constructor() {
        super("VARIABLE");
    }

    get IsSinglePiece() {
        return true;
    }

    contains(chr, next, last) {
        if (next && this.contains(next) || last && this.contains(last)) return false;

        let code = chr.charCodeAt(0);
        return code > 64 && code < 91 || code > 96 && code < 123;
    }
}
exports.default = Variable;