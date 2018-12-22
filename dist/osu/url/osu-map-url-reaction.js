"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactionPlugin = require("../../react/reaction-plugin");

var _reactionPlugin2 = _interopRequireDefault(_reactionPlugin);

var _osuApi = require("../../util/osu-api.util");

var _osuApi2 = _interopRequireDefault(_osuApi);

var _osuApi3 = require("../../resources/osu-api");

var _osuApi4 = _interopRequireDefault(_osuApi3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class OsuMapURLReaction extends _reactionPlugin2.default {
    constructor(manager) {
        super(manager);

        this.urlRegex = /(https?:\/\/osu.ppy.sh\/b(eatmapsets)?[^\s]+)/g;
        this.mapRegex = /(https?:\/\/osu.ppy.sh\/b(eatmapsets)?\/)/g;
        this.setIdRegex = /^\d+/g;
    }

    onMessage(msg) {
        let urlList = msg.Text.match(this.urlRegex);

        if (!urlList) return;

        let usedURL = [];
        for (let url of urlList) {
            if (usedURL.includes(url)) continue;

            let idList = url.replace(this.mapRegex, '').match(this.setIdRegex);

            if (!idList) continue;

            let id = idList[0];

            _osuApi2.default.getBeatmapListAsync(_osuApi4.default.key, Number.parseInt(id)).then(list => {
                for (let obj of list) {
                    var infoMessage = `비트맵 정보\n\n${obj.artist} - ${obj.title}\nbpm: ${obj.bpm}\n제작자: ${obj.creator}\n업데이트 날짜: ${obj.last_update}\n태그: ${obj.tags}`;

                    msg.reply(infoMessage);

                    return;
                }
            }).catch(e => {
                msg.reply(`비트맵 정보를 가져오는중 오류가 발생 했습니다`);
            });

            usedURL.push(url);
        }
    }

}
exports.default = OsuMapURLReaction;