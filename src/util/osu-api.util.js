import { RequestHelper } from "storybot-core";

export default class OsuApiUtil {

    static getAPIURL() {
        return 'https://osu.ppy.sh/api';
    }

    static async getBeatmapListAsync(key, beatmapSetId){
        var rawJson = await RequestHelper.get(`${OsuApiUtil.getAPIURL()}/get_beatmaps?k=${key}&s=${beatmapSetId}`);

        return JSON.parse(rawJson);
    }

}