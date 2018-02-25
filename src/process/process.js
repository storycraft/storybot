import fs from 'fs';
import childProcess from 'child_process';
import { EventEmitter } from 'events';

export default class Process extends EventEmitter {
    constructor(startCommand){
        super();
        this.startCommand = startCommand;

        this.proc = null;
        this.started = false;
    }

    get StartCommand(){
        return this.startCommand;
    }

    get Started(){
        return this.started;
    }

    get Proc(){
        return this.proc;
    }

    get StdOut(){
        if (!this.Started)
            return null;

        return this.proc.stdout;
    }

    get StdIn(){
        if (!this.Started)
            return null;

        return this.proc.stdin;
    }

    get StdErr(){
        if (!this.Started)
            return null;

        return this.proc.stderr;
    }

    get Pid(){
        if (!this.Started)
            return -1;

        return this.proc.pid;
    }

    createProcess(args){
        return childProcess.spawn(this.StartCommand, args);
    }

    start(...args){
        if (this.Started)
            throw new Error('Process already started');
        this.started = true;

        this.proc = this.createProcess(args);

        this.proc.on('exit', this.onStop.bind(this));
        this.proc.on('message', (message, sendHandle) => this.emit(message, sendHandle));
    }

    stop(){
        if (!this.Started)
            throw new Error('Process is not started');

        this.proc.kill();

        this.onStop();
    }

    onStop(){
        this.started = false;
        this.proc = null;

        this.emit('stop');
    }
}