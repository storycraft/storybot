"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class RandomGenerator {
    static generate() {
        return Math.random().toString(36).substr(2, 9);
    }
}
exports.default = RandomGenerator;