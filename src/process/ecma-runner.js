import Process from './process';

import fs from 'fs';
import { CommandListener } from 'storybot-core';

export default class EcmaRunner extends CommandListener { 
    constructor(main){
        super();

        this.main = main;

        this.main.CommandManager.on('js', this.onCommand.bind(this));
        this.main.CommandManager.on('ecma', this.onCommand.bind(this));

        this.first = true;
    }

    get Description(){
        return 'js 하실 | 사용법 : *ecma \`<소스>\`';
    }

    get Aliases(){
        return ['js', 'ecma'];
    }

    async run(source, channel){
        var path = await this.writeTempFile(source);

        var proc = new Process(`node`);

        proc.start(path);
        channel.send(`프로세스 ${proc.Pid} 가 실행되었습니다`);

        var stdoutProcess = (data) => {
            channel.send(data + '');
        }

        proc.StdOut.on('data', stdoutProcess);
        proc.StdErr.on('data', stdoutProcess);

        this.main.ProcessManager.addProcess(proc);
    }

    async writeTempFile(code) {
        if (!fs.existsSync('./code')) {
            fs.mkdirSync('./code', 484/*0744*/);
        }

        if (!fs.existsSync('./code/node')) {
            fs.mkdirSync('./code/node', 484);
        }

        var fileName = 'Source-' + Math.floor(Math.random() * 100000) + '-' + new Date().getTime();
        var path = './code/node/' + fileName + '.js';

        await new Promise((resolve, reject) => fs.writeFile(path, code, (err) => {
            if (err){
                reject(err);
            }
            else{
                resolve();
            }
        }));

        return path;
    }

    onCommand(args, user, bot, channel){
        if (args.length < 1){
            channel.send('기본 사용법: *ecma \`<소스>\`');
            return;
        }
        var sourceSplited = args.join(' ').split('`');

        if (sourceSplited.length != 3){
            channel.send('사용법: *ecma \`<소스>\`');
            return;
        }

        var source = sourceSplited[1];

        if (this.first){
            this.first = false;
            channel.send('해당 소스 실행으로 인한 채널 메세지 피해는 Storybot에서 책임 지지 않습니다');
        }

        this.run(source, channel);
    }
}