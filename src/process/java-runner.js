import Process from './process';

import fs from 'fs';
import childProcess from 'child_process';

import ProgramRunner from './program-runner';

export default class JavaRunner extends ProgramRunner { 
    constructor(main){
        super(main);

        this.main.CommandManager.on('java', this.onCommand.bind(this));
    }

    get Description(){
        return 'God drinks Java | 사용법: *java <메인 클래스 이름> \\\`\\\`\\\`java\n<소스>\n\\\`\\\`\\\`';
    }

    get Aliases(){
        return ['java'];
    }

    get CodePath(){
        return './code/java';
    }

    async run(source, mainClass, channel){
        var projectName = this.NewProjectName;
        var path = await this.writeTempFile(projectName, mainClass, source);
    
        try{
            await this.compileJava(path);
        } catch(err){
            channel.send(`컴파일 중 오류가 발생했습니다\n${err}`);
        }

        var proc = new Process('java');

        proc.start(this.CodePath + '/' + projectName + '/' + mainClass + '.class');
        channel.send(`프로세스 \`${proc.Pid}\`가 실행되었습니다`);

        var stdoutProcess = (data) => {
            channel.send(data + '');
        }

        proc.StdOut.on('data', stdoutProcess);
        proc.StdErr.on('data', stdoutProcess);

        this.main.ProcessManager.addProcess(proc);
    }

    async compileJava(path){
        var compileProcess = childProcess.exec('javac ' + path);

        await new Promise((resolve, reject) => compileProcess.on('exit', (err, stdout, stderr) => {
            if (err || stderr){
                reject('Program ended with ' + err + '\n' + stderr.toString());
                return;
            }

            resolve(stdout);
        }));
    }

    get NewProjectName(){
        return `project-${Math.floor(Math.random() * 100000)}-${new Date().getTime()}`;
    }

    async writeTempFile(projectPath, className,code) {
        if (!fs.existsSync(`./code/`)) {
            fs.mkdirSync(`./code/`, 484);
        }
        
        if (!fs.existsSync(this.CodePath)) {
            fs.mkdirSync(this.CodePath, 484);
        }

        if (!fs.existsSync(this.CodePath + '/' + projectPath)) {
            fs.mkdirSync(this.CodePath + '/' + projectPath, 484);
        }

        var path = this.CodePath + '/' + projectPath + '/' + className + '.java';

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
        if (args.length < 2){
            channel.send('기본 사용법: *java <메인 클래스 이름> \\\`\\\`\\\`java\n<소스>\n\\\`\\\`\\\`');
            return;
        }

        var mainClass = args[0];
        var source = args.slice(1).join(' ');

        if (!source.startsWith('```java\n') || !source.endsWith('```')){
            channel.send('기본 사용법: *java <메인 클래스 이름> \\\`\\\`\\\`java\n<소스>\n\\\`\\\`\\\`');
            return;
        }

        source = source.substring(6, source.length - 3);

        if (this.first){
            this.first = false;
            channel.send('해당 소스 실행으로 인한 채널 메세지 피해는 Storybot에서 책임 지지 않습니다');
        }

        this.run(source, mainClass, channel);
    }
}