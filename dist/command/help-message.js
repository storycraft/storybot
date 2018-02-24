'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commandListener = require('./command-listener');

var _commandListener2 = _interopRequireDefault(_commandListener);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class HelpMessage extends _commandListener2.default {
    constructor(commandManager) {
        super();

        this.commandManager = commandManager;

        this.commandManager.on('?', this.onCommand.bind(this));
        this.commandManager.on('help', this.onCommand.bind(this));
    }

    get Description() {
        return '? 도움말 보쉴';
    }

    get Aliases() {
        return ['?', 'help'];
    }

    onCommand(args, user, bot, source) {
        var commandInfoList = this.commandManager.CommandInfoList;

        var infoMessage = '```json\n{\n';

        for (let command of commandInfoList) {
            let commands = command.Aliases.join(', ');
            let description = command.Description;

            infoMessage += `    "${commands}": "${description}",\n`;
        }

        infoMessage += '}\n```';

        source.send('Storybot 명령어 목록').then(() => {
            source.send(infoMessage);
        });
    }
}
exports.default = HelpMessage;