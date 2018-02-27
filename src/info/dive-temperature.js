import { CommandListener, RequestHelper } from 'storybot-core';

const REQUEST_URL = 'http://hangang.dkserver.wo.tc/';
/* 
 * Sample Text 
 */
export default class DiveTemperature extends CommandListener {
    constructor(main){
        super();
        this.main = main;

        //적절한 커맨드
        this.main.CommandManager.on('가즈아', this.onCommand.bind(this));
    }

    get Description(){
        return '한강 수온을 알려드릴게요';
    }

    get Aliases(){
        return ['가즈아'];
    }

    static async getTemperatureJSON(){
        let data = await RequestHelper.get(REQUEST_URL);
        
        let json = JSON.parse(data);

        return json;
    }

    onCommand(args, user, bot, source){
        let json = DiveTemperature.getTemperatureJSON().then((json) => {
            let timestamp = new Date(json['time']);
            let temp = json['temp'];
        
            source.send(timestamp.toLocaleString() + ' 기준 현재 한강 물 온도는 ' + temp + ' 도에요').then(() => {
                //사용자 편의를 위해 권장 메세지도 띄워주면 좋겠네요!
                if (temp < 13){
                    source.send('추워');
                }
                else if (temp > 20){
                    source.send('지금 점프하시면 적당해요!');
                }
            });
        }).catch((e) => {
            source.send('가즈아!!!');
        });
    }
}