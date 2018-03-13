import Storing from "./storing";
import DiveHelper from './dive-helper';
import { ClientUser } from 'storybot-core';
import ChatDecoder from "./chat-decoder";
import ReactionXd from "./reaction-xd";

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
        this.addReact(new DiveHelper(this));
        this.addReact(new ReactionXd(this));
    }

    onMessage(msg){
        if (msg.User instanceof ClientUser)
            return;

        this.reacts.forEach((reactionPlugin) => reactionPlugin.onMessage(msg, ChatDecoder.decode(msg.Text)));
    }
}