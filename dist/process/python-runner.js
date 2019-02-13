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

var _randomGenerator = require('../util/random-generator');

var _randomGenerator2 = _interopRequireDefault(_randomGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PythonRunner extends _programRunner2.default {
    constructor(main) {
        super(main);
    }

    get Description() {
        return 'Life is short, You need Python. | *python \\\`\\\`\\\`py\n<소스>\n\\\`\\\`\\\`';
    }

    get Aliases() {
        return ['python'];
    }

    get CodeType() {
        return 'py';
    }

    async run(source, channel) {
        var fileName = _randomGenerator2.default.generate() + '.py';
        var sourcePath = await super.writeTempFile(fileName, source);

        var proc = new _process2.default('python');

        proc.start(sourcePath, `${sourcePath}/${fileName}`);

        channel.send(`프로세스 \`${proc.Pid}\`이(가) 실행되었습니다`);

        var stdoutProcess = data => {
            channel.send(data + '');
        };

        proc.StdOut.on('data', stdoutProcess);
        proc.StdErr.on('data', stdoutProcess);

        this.main.ProcessManager.addProcess(proc);
    }

    onCommand(args, user, bot, channel) {
        if (args.length < 1) {
            channel.send('기본 사용법: *python \\\`\\\`\\\`py\n<소스>\n\\\`\\\`\\\`');
            return;
        }

        var source = args.join(' ');

        if (!source.startsWith('```py\n') || !source.endsWith('```')) {
            channel.send('기본 사용법: *python \\\`\\\`\\\`py\n<소스>\n\\\`\\\`\\\`');
            return;
        }

        source = source.substring(6, source.length - 3);

        if (this.first) {
            this.first = false;
            channel.send('해당 소스 실행으로 인한 채널 메세지 피해는 Storybot에서 책임 지지 않습니다');
        }

        this.run(source, channel);
    }
}
exports.default = PythonRunner;