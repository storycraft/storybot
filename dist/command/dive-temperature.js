'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _commandManager = require('./command-manager');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const REQUEST_URL = 'http://hangang.dkserver.wo.tc/';
/* 
 * Sample Text 
 */
class DiveTemperature extends _commandManager.CommandListener {
    constructor(commandManager) {
        super();
        this.commandManager = commandManager;

        //적절한 커맨드
        this.commandManager.on('가즈아', this.onCommand.bind(this));
    }

    get Description() {
        return '한강 수온을 알려드릴게요';
    }

    get Aliases() {
        return ['가즈아'];
    }

    static async getTemperatureJSON() {
        var res = await new Promise((resolve, reject) => _http2.default.get(REQUEST_URL, resolve));
        if (res.statusCode != 200) return {};

        var data = '';
        res.on('data', chunk => data += chunk);

        await new Promise((resolve, reject) => res.on('end', resolve));

        let json = JSON.parse(data);

        return json;
    }

    onCommand(args, user, bot, source) {
        let json = DiveTemperature.getTemperatureJSON().then(json => {
            let timestamp = new Date(json['time']);
            let temp = json['temp'];

            source.send(timestamp.toLocaleString() + ' 기준 현재 한강 물 온도는 ' + temp + ' 도에요').then(() => {
                //사용자 편의를 위해 권장 메세지도 띄워주면 좋겠네요!
                if (temp < 13) {
                    source.send('너무 추울듯 ㅇㅇ');
                } else if (temp > 20) {
                    source.send('지금 점프하시면 2D로 가는 포탈을 탈수 있어요!');
                }
            });
        }).catch(() => {
            source.send('가즈아!!!');
        });
    }
}
exports.default = DiveTemperature;