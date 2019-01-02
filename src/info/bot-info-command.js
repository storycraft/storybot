import { CommandListener } from "storybot-core";
import os from 'os';

export default class BotInfoCommand extends CommandListener {
    constructor(main){
        super();

        this.main = main;

        this.main.CommandManager.on('info', this.onCommand.bind(this));
    }

    get Description(){
        return '봇 정보를 볼 수 있습니다';
    }

    get Aliases(){
        return ['info'];
    }

    onCommand(args, user, bot, source){
        var infoMessage = 'Storybot 정보\n\n';

        let cpus = os.cpus();

        infoMessage += `Platform: ${os.type()} ${os.arch()}\n`;
        infoMessage += `Release: ${os.release()}\n\n`;

        infoMessage += 'CPU: ';

        let cpuNameList = [];

        for (let cpu of cpus) {
            cpuNameList.push(cpu.model);
        }

        infoMessage += cpuNameList.join(', ') + '\n';

        let totalMem = (os.totalmem() * 9.31 * Math.pow(10, -10)).toFixed(2);
        let freeMem = (os.freemem() * 9.31 * Math.pow(10, -10)).toFixed(2);
        let usingMem = (totalMem - freeMem).toFixed(2);

        infoMessage += `총 사용 가능한 메모리: ${totalMem} GB\n`;
        infoMessage += `사용중인 메모리: ${usingMem} GB (${((usingMem / totalMem) * 100).toFixed(2)} %)\n\n`;

        infoMessage += `연결된 채팅 클라이언트\n\n`;

        let clientList = this.main.Bot.ClientList;

        for (let client of clientList) {
            infoMessage += `${client.ClientInfo}\n`;
        }

        source.send(infoMessage);
    }
}