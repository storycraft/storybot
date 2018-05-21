"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class MathToken {
    constructor(type, value = "") {
        this.type = type;
        this.value = value;
    }

    get Type() {
        return this.type;
    }

    get Value() {
        return this.value;
    }

    set Value(value) {
        this.value = value;
    }

    toString() {
        return this.type.toString() + " " + this.value;
    }
}
exports.default = MathToken;