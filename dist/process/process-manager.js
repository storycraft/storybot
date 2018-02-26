'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _storybotCore = require('storybot-core');

class ProcessManager extends _storybotCore.CommandListener {
    constructor(main) {
        super();

        this.main = main;

        this.processes = new Map();

        this.main.CommandManager.on('proc', this.onCommand.bind(this));
    }

    get Description() {
        return '장비를 정지합니다 | 사용법 : *proc';
    }

    get Aliases() {
        return ['proc'];
    }

    addProcess(proc) {
        if (!proc.Started) throw new Error('This process is not started');

        var pid = proc.Pid;
        this.processes.set(pid, proc);

        proc.on('stop', () => {
            this.processes.delete(pid);
        });
    }

    onCommand(args, user, bot, source) {
        if (args.length < 1) args.push('');

        switch (args[0]) {
            case 'kill':
                if (args.length < 2) {
                    source.send('구분이 더 필요 합니다.\n사용법: *proc kill <pid>');
                    return;
                }

                var pid = args[1];

                if (!this.processes.has(pid)) {
                    source.send('해당 pid를 가진 자식 프로세스를 찾을 수 없습니다');
                    return;
                }

                this.processes.get(pid).stop();
                source.send(`프로세스 \`${pid}\`이(가) 중단되었습니다`);

                break;

            case 'list':
                var pidList = Array.from(this.processes.keys());
                source.send(`자식 프로세스 목록 ( ${this.processes.size} )\n${pidList.join('\n')}`);
                break;

            default:
                source.send('사용 가능한 서브 명령어 목록\n`kill <pid> | 해당 pid의 프로세스를 죽입니다\nlist | 실행중인 프로세스 목록을 봅니다`');
                break;
        }
    }
}
exports.default = ProcessManager;