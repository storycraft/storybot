'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _events = require('events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Process extends _events.EventEmitter {
    constructor(startCommand) {
        super();
        this.startCommand = startCommand;

        this.proc = null;
        this.started = false;
    }

    get StartCommand() {
        return this.startCommand;
    }

    get Started() {
        return this.started;
    }

    get Proc() {
        return this.proc;
    }

    get StdOut() {
        if (!this.Started) return null;

        return this.proc.stdout;
    }

    get StdIn() {
        if (!this.Started) return null;

        return this.proc.stdin;
    }

    get StdErr() {
        if (!this.Started) return null;

        return this.proc.stderr;
    }

    get Pid() {
        if (!this.Started) return -1;

        return this.proc.pid;
    }

    async sendIPC(message, sendHandle, options) {
        if (!this.Started) return;

        await new Promise((resolve, reject) => this.proc.send(message, sendHandle, options, resolve));
    }

    start(...args) {
        if (this.Started) throw new Error('Process already started');
        this.started = true;

        this.proc = _child_process2.default.spawn(this.StartCommand, args);

        this.proc.on('exit', this.stop.bind(this));
        this.proc.on('message', (message, sendHandle) => this.emit(message, sendHandle));
    }

    stop() {
        if (!this.Started) throw new Error('Process is not started');
        this.started = false;

        this.proc = null;

        this.emit('stop');
    }
}
exports.default = Process;