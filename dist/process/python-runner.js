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

class PythonRunner extends _programRunner2.default {
    constructor(main) {
        super(main);

        this.main.CommandManager.on('python', this.onCommand.bind(this));
    }

    get Description() {
        return 'Life is short, You need Python. | *python \\\`\\\`\\\`py\n<소스>\n\\\`\\\`\\\`';
    }

    get Aliases() {
        return ['python'];
    }

    get CodePath() {
        return './code/python';
    }

    async run(source, channel) {
        var path = await this.writeTempFile(source);

        var proc = new _process2.default('python');

        proc.start(path);

        channel.send(`프로세스 \`${proc.Pid}\`이(가) 실행되었습니다`);

        var stdoutProcess = data => {
            channel.send(data + '');
        };

        proc.StdOut.on('data', stdoutProcess);
        proc.StdErr.on('data', stdoutProcess);

        this.main.ProcessManager.addProcess(proc);
    }

    async writeTempFile(code) {
        if (!_fs2.default.existsSync(`./code/`)) {
            _fs2.default.mkdirSync(`./code/`, 484);
        }

        if (!_fs2.default.existsSync(`./code/python/`)) {
            _fs2.default.mkdirSync(`./code/python/`, 484);
        }

        var fileName = 'Source-' + Math.floor(Math.random() * 100000) + '-' + new Date().getTime();
        var path = `./code/python/` + fileName + '.py';

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
        if (args.length < 1) {
            channel.send('기본 사용법: *python \\\`\\\`\\\`py\n<소스>\n\\\`\\\`\\\`');
            return;
        }

        var source = args.join(' ');

        if (!source.startsWith('```py\n') || !source.endsWith('```')) {
            channel.send('기본 사용법: *python <메인 클래스 이름> \\\`\\\`\\\`py\n<소스>\n\\\`\\\`\\\`');
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