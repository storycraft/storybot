import Process from "./process";
import childProcess from 'child_process';

export default class NodeProcess extends Process {
    constructor(modulePath){
        super('node');

        this.modulePath = modulePath;
    }

    get ModulePath(){
        return this.modulePath;
    }

    set ModulePath(modulePath){
        this.modulePath = modulePath;
    }

    async sendIPC(message, sendHandle, options){
        if (!this.Started)
            return;
        
        await new Promise((resolve, reject) => this.proc.send(message, sendHandle, options, resolve));
    }

    createProcess(workDir, args){
        return childProcess.fork(this.modulePath, args, {
            'cwd': workDir,
            'silent': true//stdin stdout 분리
        });
    }
}