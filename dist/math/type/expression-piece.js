"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class ExpressionPiece {
    constructor(name) {
        this.name = name;
    }

    get Name() {
        return this.name;
    }

    get IsSinglePiece() {
        return false;
    }

    contains(chr, next, last) {}

    toString() {
        return this.Name;
    }
}
exports.default = ExpressionPiece;