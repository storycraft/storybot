'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _nodeProcess = require('./node-process');

var _nodeProcess2 = _interopRequireDefault(_nodeProcess);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _storybotCore = require('storybot-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class EcmaRunner extends _storybotCore.CommandListener {
    constructor(main) {
        super();

        this.main = main;

        this.main.CommandManager.on('js', this.onCommand.bind(this));
        this.main.CommandManager.on('ecma', this.onCommand.bind(this));

        this.first = true;

        this.hookMap = new Map();
    }

    get Description() {
        return 'js 하실 | 사용법: *ecma \\\`\\\`\\\`js\n<소스>\n\\\`\\\`\\\`';
    }

    get Aliases() {
        return ['js', 'ecma'];
    }

    async run(source, channel) {
        var path = await this.writeTempFile(source);

        var proc = new _nodeProcess2.default(path);

        proc.start();
        channel.send(`프로세스 \`${proc.Pid}\`가 실행되었습니다`);

        var stdoutProcess = data => {
            channel.send(data + '');
        };

        proc.StdOut.on('data', stdoutProcess);
        proc.StdErr.on('data', stdoutProcess);

        proc.on('stop', () => this.removeHook(proc));

        this.connectHook(proc, channel);

        this.main.ProcessManager.addProcess(proc);
    }

    connectHook(nodeProc, channel) {
        if (this.hookMap.has(nodeProc)) throw new Error('Hook already connected');

        var hook = msg => {
            nodeProc.sendIPC({ //create simplified like Message object
                'Text': msg.Text,
                'Source': { //Channel
                    'Id': msg.Source.Id,
                    'Name': msg.Source.Name
                },
                'User': { //User
                    'Id': msg.User.Id,
                    'Name': msg.User.Name,
                    'IdentityId': msg.User.IdentityId
                }
            });
        };

        this.hookMap.set(nodeProc, hook);
        channel.on('message', hook);
    }

    removeHook(nodeProc) {
        if (!this.hookMap.has(nodeProc)) throw new Error('Hook is not connected');

        channel.off('message', this.hookMap.get(nodeProc));
    }

    async writeTempFile(code) {
        if (!_fs2.default.existsSync('./code')) {
            _fs2.default.mkdirSync('./code', 484 /*0744*/);
        }

        if (!_fs2.default.existsSync('./code/node')) {
            _fs2.default.mkdirSync('./code/node', 484);
        }

        var fileName = 'Source-' + Math.floor(Math.random() * 100000) + '-' + new Date().getTime();
        var path = './code/node/' + fileName + '.js';

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
            channel.send('기본 사용법: *ecma \\\`\\\`\\\`js\n<소스>\n\\\`\\\`\\\`');
            return;
        }
        var source = args.join(' ');

        if (!source.startsWith('```js\n') || !source.endsWith('```')) {
            channel.send('기본 사용법: *ecma \\\`\\\`\\\`js\n<소스>\n\\\`\\\`\\\`');
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
exports.default = EcmaRunner;