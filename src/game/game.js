export default class Game {
    constructor(){
        this.playerList = [];
        this.started = false;
    }

    get PlayerList(){
        return this.playerList;
    }

    get Started(){
        return this.started;
    }

    start(){
        if (this.Started)
            throw new Error('game already started');
        this.started = true;
    }

    stop(){
        if (!this.Started)
            throw new Error('game is not started');
        this.started = false;
    }
}