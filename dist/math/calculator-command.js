'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _storybotCore = require('storybot-core');

class CalculatorCommand extends _storybotCore.CommandListener {
    constructor(main) {
        super();
        this.main = main;

        this.main.CommandManager.on('calc', this.onCommand.bind(this));
    }

    get Description() {
        return '계산기 쓰실 **미완성 기능** | *calc <계산식>';
    }

    get Aliases() {
        return ['calc'];
    }
}
exports.default = CalculatorCommand;