'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});

var _storybotCore = require('storybot-core');

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BotInfoCommand extends _storybotCore.CommandListener {
        constructor(main) {
                super();

                this.main = main;

                this.main.CommandManager.on('info', this.onCommand.bind(this));
        }

        get Description() {
                return '봇 정보를 볼 수 있습니다';
        }

        get Aliases() {
                return ['info'];
        }

        onCommand(args, user, bot, source) {
                var infoMessage = 'Storybot 정보\n\n';

                let cpus = _os2.default.cpus();

                infoMessage += `Platform: ${_os2.default.type()} ${_os2.default.arch()}\n`;
                infoMessage += `Release: ${_os2.default.release()}\n\n`;

                infoMessage += 'CPU: ';

                let cpuNameList = [];

                for (let cpu of cpus) {
                        cpuNameList.push(cpu.model);
                }

                infoMessage += cpuNameList.join(', ') + '\n';

                let totalMem = (_os2.default.totalmem() * 9.31 * Math.pow(10, -10)).toFixed(2);
                let freeMem = (_os2.default.freemem() * 9.31 * Math.pow(10, -10)).toFixed(2);
                let usingMem = (totalMem - freeMem).toFixed(2);

                infoMessage += `총 사용 가능한 메모리: ${totalMem} GB\n`;
                infoMessage += `사용중인 메모리: ${usingMem} GB (${(usingMem / totalMem * 100).toFixed(2)} %)\n\n`;

                infoMessage += `연결된 채팅 클라이언트\n\n`;

                let clientList = this.main.Bot.ClientList;

                for (let client of clientList) {
                        infoMessage += `${client.ClientName}, ${client.ClientUser.Name} ${client.ClientUser.Id}\n`;
                }

                source.send(infoMessage);
        }
}
exports.default = BotInfoCommand;