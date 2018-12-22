import ReactionPlugin from "../../react/reaction-plugin";
import OsuApiUtil from "../../util/osu-api.util";
import osuApi from "../../resources/osu-api";

export default class OsuMapURLReaction extends ReactionPlugin {
    constructor(manager){
        super(manager);

        this.urlRegex = /(https?:\/\/osu.ppy.sh\/b(eatmapsets)?[^\s]+)/g;
        this.mapRegex = /(https?:\/\/osu.ppy.sh\/b(eatmapsets)?\/)/g;
        this.setIdRegex = /^\d+/g;
    }

    onMessage(msg){
        let urlList = msg.Text.match(this.urlRegex);

        if (!urlList)
            return;

        let usedURL = [];
        for (let url of urlList) {
            if (usedURL.includes(url))
                continue;
            
            let idList = url.replace(this.mapRegex, '').match(this.setIdRegex);

            if (!idList)
                continue;

            let id = idList[0];

            OsuApiUtil.getBeatmapListAsync(osuApi.key, Number.parseInt(id)).then((list) => {
                for (let obj of list) {
                    var infoMessage = `비트맵 정보\n\n${obj.artist} - ${obj.title}\nbpm: ${obj.bpm}\n제작자: ${obj.creator}\n업데이트 날짜: ${obj.last_update}\n태그: ${obj.tags}`;

                    msg.reply(infoMessage);
                    
                    return;
                }
            }).catch((e) => {
                msg.reply(`비트맵 정보를 가져오는중 오류가 발생 했습니다`);
            });

            usedURL.push(url);
        }
    }

}