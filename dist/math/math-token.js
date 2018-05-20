"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class MathToken {
    constructor(type, value = "") {
        this.type = type;
        this.value = value;

        this.previousToken = null;
        this.nextToken = null;
    }

    get Type() {
        return this.type;
    }

    get Value() {
        return this.value;
    }

    get NextToken() {
        return this.nextToken;
    }

    get PreviousToken() {
        return this.previousToken;
    }

    set NextToken(nextToken) {
        this.nextToken = nextToken;
    }

    set PreviousToken(previousToken) {
        this.previousToken = previousToken;
    }

    set Value(value) {
        this.value = value;
    }

    toString() {
        return this.type.toString() + " " + this.value;
    }
}
exports.default = MathToken;