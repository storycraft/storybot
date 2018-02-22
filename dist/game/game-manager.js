'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
class GameManager {
    constructor(main) {
        this.main = main;

        this.gameList = [];
    }

    get Main() {
        return this.main;
    }

    isPlayingGame(user) {
        for (let game of this.gameList) {
            if (game.PlayerList.includes(user)) return true;
        }

        return false;
    }

    hasGame(game) {
        return this.gameList.includes(game);
    }

    addGame(game) {
        if (this.hasGame(game)) throw new Error('game already added');

        this.gameList.push(game);
    }

    removeGame(game) {
        if (!this.hasGame(game)) throw new Error('game is not added');

        this.gameList.splice(this.gameList.indexOf(game), 1);
    }
}
exports.default = GameManager;