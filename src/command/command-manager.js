import { EventEmitter } from "events";
import HelpMessage from "./help-message";
import DiveTemperature from "./dive-temperature";

const COMMAND_PREFIX = '*';

export default class CommandManager extends EventEmitter {
    constructor(main){
        super();

        this.main = main;
        
        this.commandInfoList = [];

        this.Bot.on('message', this.onCommand.bind(this));

        this.initCommands();
    }

    get Main(){
        return this.main;
    }

    get Bot(){
        return this.Main.Bot;
    }

    get CommandInfoList(){
        return this.commandInfoList;
    }

    onCommand(msg){
        if (!msg.Message.startsWith(COMMAND_PREFIX))
            return;

        var tokens = msg.Message.split(' ');

        var command = tokens[0].substring(1);
        var args = tokens.slice(1);

        if (command == '')
            return;

        //WTF best idea ever
        this.emit(command, args, msg.User, this.Bot, msg.Source);
    }

    addCommandInfo(command){
        this.CommandInfoList.push(command);
    }

    removeCommandInfo(command){
        this.CommandInfoList.splice(this.CommandInfoList.indexOf(command), 1);
    }

    initCommands(){
        this.addCommandInfo(new HelpMessage(this));

        this.addCommandInfo(new DiveTemperature(this));

    }
}

export class CommandListener {
    constructor(){

    }

    get Description(){
        return '';
    }

    get Aliases(){
        return [];
    }
}