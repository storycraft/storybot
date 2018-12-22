"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _storybotCore = require("storybot-core");

class OsuApiUtil {

    static getAPIURL() {
        return 'https://osu.ppy.sh/api';
    }

    static async getBeatmapListAsync(key, beatmapSetId) {
        var rawJson = await _storybotCore.RequestHelper.get(`${OsuApiUtil.getAPIURL()}/get_beatmaps?k=${key}&s=${beatmapSetId}`);

        return JSON.parse(rawJson);
    }

}
exports.default = OsuApiUtil;