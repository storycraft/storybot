import Process from './process';

import fs from 'fs';
import { CommandListener } from 'storybot-core';

export default class ProgramRunner extends CommandListener { 
    constructor(main){
        super();

        this.main = main;

        this.first = true;
    }

    get Description(){
        return '';
    }

    get Aliases(){
        return [];
    }

    get Language(){
        return '';
    }

    get SourceExt(){
        return '';
    }

    async run(source, channel){

    }

    async writeTempFile(code) {
        if (!fs.existsSync('./code')) {
            fs.mkdirSync('./code', 484/*0744*/);
        }

        if (!fs.existsSync(`./code/${this.Language}`)) {
            fs.mkdirSync(`./code/${this.Language}`, 484);
        }

        var fileName = 'Source-' + Math.floor(Math.random() * 100000) + '-' + new Date().getTime();
        var path = `./code/${this.Language}/` + fileName + '.' + this.SourceExt;

        await new Promise((resolve, reject) => fs.writeFile(path, code, (err) => {
            if (err){
                reject(err);
            }
            else{
                resolve();
            }
        }));

        return path;
    }

    onCommand(args, user, bot, channel){

    }
}