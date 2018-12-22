import Storing from "./storing";
import { ClientUser } from 'storybot-core';
import ChatDecoder from "./chat-decoder";
import ReactionXd from "./reaction-xd";
import OsuMapURLReaction from "../osu/url/osu-map-url-reaction";

export default class ReactManager {
    constructor(main){
        this.main = main;

        this.reacts = [];

        this.init();

        this.Main.Bot.on('message', this.onMessage.bind(this));
    }

    get Main(){
        return this.main;
    }

    get Reacts(){
        return this.reacts;
    }

    addReact(reactionPlugin){
        this.reacts.push(reactionPlugin);
    }

    init(){
        this.addReact(new ReactionXd(this));
        this.addReact(new OsuMapURLReaction(this));
    }

    onMessage(msg){
        if (msg.User instanceof ClientUser)
            return;

        this.reacts.forEach((reactionPlugin) => reactionPlugin.onMessage(msg, ChatDecoder.decode(msg.Text)));
    }
}