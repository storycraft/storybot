'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _process = require('./process');

var _process2 = _interopRequireDefault(_process);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NodeProcess extends _process2.default {
    constructor(modulePath) {
        super('node');

        this.modulePath = modulePath;
    }

    get ModulePath() {
        return this.modulePath;
    }

    set ModulePath(modulePath) {
        this.modulePath = modulePath;
    }

    async sendIPC(message, sendHandle, options) {
        if (!this.Started) return;

        await new Promise((resolve, reject) => this.proc.send(message, sendHandle, options, resolve));
    }

    createProcess(workDir, args) {
        return _child_process2.default.fork(this.modulePath, args, {
            'cwd': workDir,
            'silent': true, //stdin stdout 분리
            'env': {}
        });
    }
}
exports.default = NodeProcess;