'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _storybotCore = require('storybot-core');

const GOOGLE_MAP_KEY = 'AIzaSyAmti-O_lwOk6bmECOfKCbYItc4g21PAYk';
const DARKSKY_API_KEY = 'defffc5f4a37378fb204b634ca7ef8d9';

const ICON_DESCRIPTION = {
    'clear-day': '맑음',
    'clear-night': '맑음',
    'rain': '비 내림',
    'snow': '눈 내림',
    'sleet': '진눈깨비가 날림',
    'wind': '바람',
    'fog': '안개',
    'cloudy': '구름 낌',
    'partly-cloudy-day': '약간 구름 낌',
    'partly-cloudy-night': '약간 구름 낌'
};

const PRECIP_DESCRIPTION = {
    'rain': '비',
    'snow': '눈',
    'sleet': '진눈깨비'
};

class WeatherForecast extends _storybotCore.CommandListener {
    constructor(main) {
        super();

        this.main = main;

        this.main.CommandManager.on('날씨', this.onCommand.bind(this));
        this.main.CommandManager.on('weather', this.onCommand.bind(this));
    }

    get Description() {
        return '이불 밖은 위험해요. ㄷㄷ | *날씨 <위치>';
    }

    get Aliases() {
        return ['날씨', 'weather'];
    }

    async getGeometryInfo(address) {
        //인코딩 설정
        let data = await _storybotCore.RequestHelper.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${GOOGLE_MAP_KEY}&language=ko&address=${encodeURI(address)}`);
        return JSON.parse(data);
    }

    async getWeatherInfo(lat, lng) {
        let data = await _storybotCore.RequestHelper.get(`https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${lat},${lng}?exclude=minutely,hourly,daily,alerts,flags&units=si`);

        return JSON.parse(data);
    }

    async editStatus(msg, text) {
        if (msg.Editable) {
            return await msg.edit(text);
        } else {
            return (await msg.Source.send(text))[0];
        }
    }

    onCommand(args, user, bot, source) {
        if (args.length < 1) {
            source.send('적절한 사용법: *날씨 <위치>');
            return;
        }

        let text = args.join(' ');
        source.send('날씨 데이터 받아오는중').then(messages => {
            var msg = messages[0];

            this.getGeometryInfo(text).then(json => {
                switch (json['status']) {
                    case 'ZERO_RESULTS':
                        this.editStatus(msg, '`' + text + '` 위치를 찾을수가 없어요 ㅜㅜ');
                        break;

                    case 'OK':
                        //자동으로 첫번째 위치 선택
                        var result = json['results'][0];

                        var location = result['geometry']['location'];
                        this.getWeatherInfo(location['lat'], location['lng']).then(weatherJson => {
                            let currentWeather = weatherJson['currently'];

                            //텍스트공백 제거
                            let infoText = `
${result['formatted_address']} 의 현재 날씨

${ICON_DESCRIPTION[currentWeather['icon']]}
${currentWeather['summary']}

현재 온도: ${currentWeather['temperature']} °C, 체감 온도: ${currentWeather['apparentTemperature']} °C
습도: ${(currentWeather['humidity'] * 100).toFixed(2)} %, 자외선 지수: ${currentWeather['uvIndex']}
풍속: ${currentWeather['windSpeed']} m/s`;

                            if (currentWeather['visibility']) infoText += `, 가시 거리: ${currentWeather['visibility']} km`;

                            if (currentWeather['precipType']) infoText += `\n${PRECIP_DESCRIPTION[currentWeather['precipType']]} 이(가) 내릴 확률 ${(currentWeather['precipProbability'] * 100).toFixed(2)} %`;

                            if (currentWeather['pressure']) infoText += `\n기압 : ${currentWeather['pressure']} hPa`;

                            if (currentWeather['ozone']) infoText += `\n오존 : ${currentWeather['ozone']} DU`;

                            //Powered by text
                            infoText += '\n`Powered by Dark Sky https://darksky.net/poweredby/`';

                            this.editStatus(msg, infoText);
                        }).catch(e => {
                            this.editStatus(msg, `날씨 정보를 받아 오는중 오류가 발생했습니다 몇번 더 처 보고 안되면 떄려치세요\n\`${e}\``);
                        });
                        break;

                    case 'OVER_QUERY_LIMIT':
                        this.editStatus(msg, '요청가능 할당량이 초과 됐대요 개발자 갈구셈 ㅇㅇ');
                        break;

                    case 'REQUEST_DENIED':
                        this.editStatus(msg, '요청이 거부되었습니다(?)');
                        break;

                    case 'INVALID_REQUEST':
                        this.editStatus(msg, '뭔 지거리를 하는거야');
                        break;

                    case 'UNKNOWN_ERROR':
                        this.editStatus(msg, '알 수 없는 에러라는데, 다시 쳐봐요 ㅇㅇ');
                        break;

                    default:
                        break;
                }
            }).catch(e => {
                this.editStatus(msg, `위치 정보를 받아오는중 오류가 발생했습니다 몇번 더 처 보고 안되면 떄려치세요\n\`${e}\``);
            });
        });
    }
}
exports.default = WeatherForecast;