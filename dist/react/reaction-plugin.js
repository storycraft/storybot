"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class ReactionPlugin {
    constructor(manager) {
        this.manager = manager;
    }

    get Manager() {
        return this.manager;
    }

    onMessage(msg) {}
}
exports.default = ReactionPlugin;