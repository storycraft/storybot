export default class Game {
    constructor(playChannel){
        this.playChannel = playChannel;

        this.playerList = [];
        this.started = false;

        this.gameManager = null;
    }

    get PlayerList(){
        return this.playerList;
    }

    get Started(){
        return this.started;
    }

    get PlayChannel(){
        return this.playChannel;
    }

    start(gameManager){
        if (this.Started)
            throw new Error('game already started');
        this.started = true;
        this.gameManager = gameManager;
    }

    stop(){
        if (!this.Started)
            throw new Error('game is not started');
        this.started = false;

        this.gameManager.removeGame(this);
    }
}