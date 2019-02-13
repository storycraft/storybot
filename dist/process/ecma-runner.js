'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _nodeProcess = require('./node-process');

var _nodeProcess2 = _interopRequireDefault(_nodeProcess);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _programRunner = require('./program-runner');

var _programRunner2 = _interopRequireDefault(_programRunner);

var _randomGenerator = require('../util/random-generator');

var _randomGenerator2 = _interopRequireDefault(_randomGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class EcmaRunner extends _programRunner2.default {
    constructor(main) {
        super(main);

        this.hookMap = new Map();
    }

    get Description() {
        return 'js 하실 | *ecma \\\`\\\`\\\`js\n<소스>\n\\\`\\\`\\\`';
    }

    get Aliases() {
        return ['js', 'ecma'];
    }

    get CodeType() {
        return 'node';
    }

    async run(source, channel) {
        var fileName = _randomGenerator2.default.generate() + '.js';
        var sourcePath = await this.writeTempFile(fileName, source);

        var proc = new _nodeProcess2.default(`${sourcePath}/${fileName}`);

        proc.start(sourcePath);
        channel.send(`프로세스 \`${proc.Pid}\`이(가) 실행되었습니다`);

        var stdoutProcess = data => {
            channel.send(data + '');
        };

        proc.StdOut.on('data', stdoutProcess);
        proc.StdErr.on('data', stdoutProcess);

        proc.on('stop', () => this.removeHook(proc, channel));

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

    removeHook(nodeProc, channel) {
        if (!this.hookMap.has(nodeProc)) throw new Error('Hook is not connected');

        channel.removeListener('message', this.hookMap.get(nodeProc));
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