'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _compileRun = require('compile-run');

var _compileRun2 = _interopRequireDefault(_compileRun);

var _storybotCore = require('storybot-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class EcmaRunner extends _storybotCore.CommandListener {
    constructor(main) {
        super();

        this.main = main;

        this.main.CommandManager.on('js', this.onCommand.bind(this));
        this.main.CommandManager.on('ecma', this.onCommand.bind(this));
    }

    get Description() {
        return 'js 하실 | 사용법 : *ecma \`<소스>\`';
    }

    get Aliases() {
        return ['js', 'ecma'];
    }

    run(source, channel) {
        _compileRun2.default.runNode(this.source, null, (stdout, stderr, err) => {
            if (err) {
                channel.send(`소스 실행중 오류가 발생했습니다\n${err}`);
                return;
            }

            channel.send('프로세스가 실행 되었습니다');

            var stdoutProcess = data => {
                channel.send(data);
            };

            stdout.on('data', stdoutProcess);
            stderr.on('data', stdoutProcess);
        });
    }

    onCommand(args, user, bot, channel) {
        var sourceSplited = args.join(' ').split('`');

        if (sourceSplited.length != 3) {
            channel.send('사용법: *ecma \`<소스>\`');
            return;
        }

        var source = sourceSplited[1];

        channel.send('해당 소스 실행으로 인한 stdout 메세지 스팸 등은 Storybot에서 책임 지지 않습니다');
        this.run(source, channel);
    }
}
exports.default = EcmaRunner;