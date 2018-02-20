'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const REQUEST_URL = 'http://hangang.dkserver.wo.tc/';

class DiveTemperature {
    constructor(main) {
        this.main = main;

        //적절한 커맨드겠지
        this.main.CommandManager.on('가즈아', this.onCommand.bind(this));
    }

    onCommand(args, user, bot, source) {
        _http2.default.get(REQUEST_URL, res => {
            if (res.statusCode != 200) return; //아무일 없었다는 듯이 명령어를 씹습니다

            var data = '';
            res.on('data', chunk => data += chunk);

            res.on('end', () => {
                let json = JSON.parse(data);

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
            });
        });
    }
}
exports.default = DiveTemperature;