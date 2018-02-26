import Process from './process';

import fs from 'fs';
import childProcess from 'child_process';

import ProgramRunner from './program-runner';

import gulp from 'gulp';
import javac from 'gulp-javac';

import jre from 'node-jre';

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

    get Language(){
        return 'java';
    }

    get SourceExt(){
        return 'java';
    }

    async run(source, mainClass, channel){
        var projectPath = this.getNewProjectPath();
        var path = await this.writeTempFile(projectPath, mainClass, source);

        await this.compileJava(projectPath + '/' + path);

        var proc = jre.spawn([ projectPath + '/out/executable.jar' ], mainClass);
        channel.send(`프로세스 \`${proc.Pid}\`가 실행되었습니다`);

        var stdoutProcess = (data) => {
            channel.send(data + '');
        }

        proc.StdOut.on('data', stdoutProcess);
        proc.StdErr.on('data', stdoutProcess);

        this.main.ProcessManager.addProcess(proc);
    }

    async compileJava(path){
        return gulp.src(path).pipe(javac('executable.jar').pipe(gulp.dest('out')));
    }

    getNewProjectPath(){
        return `./code/${this.Language}/Source-${Math.floor(Math.random() * 100000)}-${new Date().getTime()}`;
    }

    async writeTempFile(projectPath, className,code) {
        if (!fs.existsSync('./code')) {
            fs.mkdirSync('./code', 484/*0744*/);
        }

        if (!fs.existsSync(`./code/${this.Language}`)) {
            fs.mkdirSync(`./code/${this.Language}`, 484);
        }

        var path = projectPath + '/' + className + '.' + this.SourceExt;

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