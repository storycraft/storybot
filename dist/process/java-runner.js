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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class JavaRunner extends _programRunner2.default {
    constructor(main) {
        super(main);
    }

    get Description() {
        return 'God drinks Java | *java <메인 클래스 이름> \\\`\\\`\\\`java\n<소스>\n\\\`\\\`\\\`';
    }

    get Aliases() {
        return ['java'];
    }

    get CodeType() {
        return 'java';
    }

    async run(source, mainClass, channel) {
        var sourcePath = await this.writeTempFile(mainClass + '.java', source);

        try {
            await this.compileJava(path);
        } catch (err) {
            channel.send(`컴파일 중 오류가 발생했습니다\n${err}`);
            return;
        }

        var proc = new _process2.default('java');

        proc.start(sourcePath, '-classpath', sourcePath, mainClass);
        channel.send(`프로세스 \`${proc.Pid}\`이(가) 실행되었습니다`);

        var stdoutProcess = data => {
            channel.send(data + '');
        };

        proc.StdOut.on('data', stdoutProcess);
        proc.StdErr.on('data', stdoutProcess);

        this.main.ProcessManager.addProcess(proc);
    }

    async compileJava(path) {
        var compileProcess = _child_process2.default.spawn(`javac`, [path], { encoding: 'utf8' });

        var outData = '';
        compileProcess.stdout.on('data', data => {
            data += outData;
        });

        var errData = '';

        compileProcess.on('error', err => {
            errData += err;
        });

        compileProcess.stderr.on('data', data => {
            errData += data;
        });

        await new Promise((resolve, reject) => compileProcess.on('exit', code => {
            if (code) {
                reject('Program ended with code ' + code + '\n' + errData);
                return;
            }

            resolve(outData);
        }));
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

        source = source.substring(7, source.length - 3);

        if (this.first) {
            this.first = false;
            channel.send('해당 소스 실행으로 인한 채널 메세지 피해는 Storybot에서 책임 지지 않습니다');
        }

        this.run(source, mainClass, channel);
    }
}
exports.default = JavaRunner;