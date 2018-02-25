import { CommandListener } from "storybot-core";

export default class ProcessManager extends CommandListener {
    constructor(main){
        super();

        this.main = main;

        this.processes = {};

        this.main.CommandManager.on('proc', this.onCommand.bind(this));
    }

    get Description(){
        return '장비를 정지합니다 | 사용법 : *proc';
    }

    get Aliases(){
        return ['proc'];
    }

    addProcess(proc){
        if (!proc.Started)
            throw new Error('This process is not started');

        var pid = proc.Pid;
        this.processes[pid] = proc;

        proc.on('stop', () => {
            this.processes[pid] = null;
        });
    }

    onCommand(args, user, bot, source){
        if (args.length < 1)
            args.push('');

        switch(args[0]){
            case 'kill':
                if (args.length < 2){
                    source.send('구분이 더 필요 합니다.\n사용법: *proc kill <pid>');
                    return;
                }

                var pid = args[1];

                if (!this.processes[pid]){
                    source.send('해당 pid를 가진 자식 프로세스를 찾을 수 없습니다');
                    return;
                }

                this.processes[pid].stop();
                source.send(`프로세스 ${pid} 이(가) 중단되었습니다`);

                break;

            default:
                source.send('사용 가능한 서브 명령어 목록\n`kill <pid> | 해당 pid의 프로세스를 죽입니다`');
                break;
        }
    }
}