import { CommandListener } from 'storybot-core';
import fs from 'fs';
import os from 'os';
import RandomGenerator from '../util/random-generator';

export default class ProgramRunner extends CommandListener { 
    constructor(main){
        super();

        this.main = main;
        this.basePath = `${this.BotPath}/${this.CodeType}-source`;

        this.first = true;
    }

    get Description(){
        return '';
    }

    get Aliases(){
        return [];
    }

    get CodeType(){
        return 'code';
    }

    get BotPath() {
        return `${os.tmpdir()}/storybot`;
    }

    get SourcePath() {
        return this.basePath;
    }

    async writeTempFile(fileName, code) {
        var basePath = this.SourcePath;
        var sourcePath = `${basePath}/${RandomGenerator.generate()}`;
        var path = `${sourcePath}/${fileName}`;

        if (!fs.existsSync(this.BotPath)) {
            fs.mkdirSync(this.BotPath, 484);
        }

        if (!fs.existsSync(basePath)) {
            fs.mkdirSync(basePath, 484);
        }

        if (!fs.existsSync(sourcePath)) {
            fs.mkdirSync(sourcePath, 484);
        }

        await new Promise((resolve, reject) => fs.writeFile(path, code, (err) => {
            if (err){
                reject(err);
            }
            else{
                resolve();
            }
        }));

        return sourcePath;
    }
    
    async run(source, channel){

    }

    onCommand(args, user, bot, channel){

    }
}