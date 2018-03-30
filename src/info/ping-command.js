import { CommandListener, RequestHelper } from 'storybot-core';

const DISCORD_SERVER = 'https://discordapp.com/';
const LINE_SERVER = 'https://api.line.me/v2/bot/';
const KAKAO_SERVER = 'https://www.kakaocorp.com/service/KakaoTalk/';

export default class PingCommand extends CommandListener {
    constructor(main){
        super();
        this.main = main;

        //적절한 커맨드
        this.main.CommandManager.on('ping', this.onCommand.bind(this));
    }

    get Description(){
        return 'pong!';
    }

    get Aliases(){
        return ['ping'];
    }

    async getDiscordPing(){
        let discordStart = new Date();
        let Discordresponse = await RequestHelper.get(DISCORD_SERVER);
        let discordEnd = new Date();

        return discordEnd - discordStart;
    }

    async getLinePing(){
        let lineStart = new Date();
        let lineResponse = await RequestHelper.get(LINE_SERVER);
        let lineEnd = new Date();

        return lineEnd - lineStart;
    }

    async getKakaoPing(){
        let kakaoStart = new Date();
        let kakaoResponse = await RequestHelper.get(KAKAO_SERVER);
        let kakaoEnd = new Date();

        return kakaoEnd - kakaoStart;
    }

    async onCommand(args, user, bot, source){
        let result = await Promise.all([ this.getDiscordPing(), this.getLinePing(), this.getKakaoPing()] );

        source.send(`디스코드: \`${result[0]}\` ms\n라인: \`${result[1]}\` ms\n카카오 서비스: \`${result[1]}\` ms`);
    }
}