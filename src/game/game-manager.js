export default class GameManager {
    constructor(main){
        this.main = main;

        this.gameList = [];
    }
    
    get Main(){
        return this.main;
    }

    get FirebaseGameDb(){
        return this.Main.FirebaseManager.Database.ref('game');
    }

    get FirebaseGameStorage(){
        return this.Main.FirebaseManager.Storage.ref('game');
    }

    isPlayingGame(user){
        for (let game of this.gameList){
            if (game.PlayerList.includes(user))
                return true;
        }

        return false;
    }

    hasGame(game){
        return this.gameList.includes(game);
    }

    addGame(game){
        if (this.hasGame(game))
            throw new Error('game already added');

        this.gameList.push(game);
        
        game.start(this);
    }

    removeGame(game){
        if (!this.hasGame(game))
        throw new Error('game is not added');

        this.gameList.splice(this.gameList.indexOf(game), 1);
    }
}