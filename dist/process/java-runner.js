'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _process = require('./process');

var _process2 = _interopRequireDefault(_process);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _programRunner = require('./program-runner');

var _programRunner2 = _interopRequireDefault(_programRunner);

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpJavac = require('gulp-javac');

var _gulpJavac2 = _interopRequireDefault(_gulpJavac);

var _nodeJre = require('node-jre');

var _nodeJre2 = _interopRequireDefault(_nodeJre);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class JavaRunner extends _programRunner2.default {
    constructor(main) {
        super(main);

        this.main.CommandManager.on('java', this.onCommand.bind(this));
    }

    get Description() {
        return 'God drinks Java | 사용법: *java <메인 클래스 이름> \\\`\\\`\\\`java\n<소스>\n\\\`\\\`\\\`';
    }

    get Aliases() {
        return ['java'];
    }

    get CodePath() {
        return './code/java';
    }

    async run(source, mainClass, channel) {
        var projectName = this.NewProjectName;
        var path = await this.writeTempFile(projectName, mainClass, source);

        console.log(this.compileJava(path));

        var proc = _process2.default.fromProcess(_nodeJre2.default.spawn([this.CodePath + '/' + projectName + '/executable.jar'], mainClass));
        channel.send(`프로세스 \`${proc.Pid}\`가 실행되었습니다`);

        var stdoutProcess = data => {
            channel.send(data + '');
        };

        proc.StdOut.on('data', stdoutProcess);
        proc.StdErr.on('data', stdoutProcess);

        this.main.ProcessManager.addProcess(proc);
    }

    async compileJava(path) {
        return _gulp2.default.src(path).pipe(_gulpJavac2.default.javac()).pipe(_gulpJavac2.default.jar('executable.jar')).pipe(_gulp2.default.dest('executable.jar'));
    }

    get NewProjectName() {
        return `project-${Math.floor(Math.random() * 100000)}-${new Date().getTime()}`;
    }

    async writeTempFile(projectPath, className, code) {
        if (!_fs2.default.existsSync(`./code/`)) {
            _fs2.default.mkdirSync(`./code/`, 484);
        }

        if (!_fs2.default.existsSync(this.CodePath)) {
            _fs2.default.mkdirSync(this.CodePath, 484);
        }

        if (!_fs2.default.existsSync(this.CodePath + '/' + projectPath)) {
            _fs2.default.mkdirSync(this.CodePath + '/' + projectPath, 484);
        }

        var path = this.CodePath + '/' + projectPath + '/' + className + '.java';

        await new Promise((resolve, reject) => _fs2.default.writeFile(path, code, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        }));

        return path;
    }

    onCommand(args, user, bot, channel) {
        if (args.length < 2) {
            channel.send('기본 사용법: *java <메인 클래스 이름> \\\`\\\`\\\`java\n<소스>\n\\\`\\\`\\\`');
            return;
        }

        var mainClass = args[0];
        var source = args.slice(1).join(' ');

        if (!source.startsWith('```java\n') || !source.endsWith('```')) {
            channel.send('기본 사용법: *java <메인 클래스 이름> \\\`\\\`\\\`java\n<소스>\n\\\`\\\`\\\`');
            return;
        }

        source = source.substring(6, source.length - 3);

        if (this.first) {
            this.first = false;
            channel.send('해당 소스 실행으로 인한 채널 메세지 피해는 Storybot에서 책임 지지 않습니다');
        }

        this.run(source, mainClass, channel);
    }
}
exports.default = JavaRunner;