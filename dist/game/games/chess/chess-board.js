'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _chessPieces = require('./chess-pieces');

/*
 * 체스판은 8 x 8의 게임판에서 진행되는 2인 제로섬 유한 확정 완전정보 게임 입니다
 * https://namu.wiki/w/체스
 */
class ChessBoard {
    constructor(game) {
        this.game = game;

        this.boardPieces = [];

        this.blackPieces = [];
        this.whitePieces = [];

        this.blackKing = null;
        this.whiteKing = null;

        this.deadPieces = [];

        this.createDefault();
    }

    get BoardPieces() {
        return this.boardPieces;
    }

    get BlackPieces() {
        return this.blackPieces;
    }

    get WhitePieces() {
        return this.whitePieces;
    }

    get DeadPieces() {
        return this.deadPieces;
    }

    get BlackKingDied() {
        return this.DeadPieces.includes(this.blackKing);
    }

    get WhiteKingDead() {
        return this.DeadPieces.includes(this.whiteKing);
    }

    getPieceAt(location) {
        for (let piece of this.boardPieces) {
            if (piece.Location == location) return piece;
        }

        return null;
    }

    movePieceTo(piece, location) {
        var enemyPieces = null;
        if (this.WhitePieces.includes(piece)) enemyPieces = this.BlackPieces;else if (this.BlackPieces.includes(piece)) enemyPieces = this.WhitePieces;else throw new Error('알수 없는 체스 말 입니다');

        var arrPiece = this.getPieceAt(location);
        if (arrPiece && enemyPieces.includes(arrPiece)) {
            enemyPieces.splice(enemyPieces.indexOf(arrPiece), 1);
            this.deadPieces.push(arrPiece);
        }

        piece.Location = location;
    }

    createDefault() {
        //흑 피스 배치
        this.addBlackPiece(new _chessPieces.RookPiece(this, 7));
        this.addBlackPiece(new _chessPieces.KnightPiece(this, 15));
        this.addBlackPiece(new _chessPieces.BishopPiece(this, 23));
        this.addBlackPiece(new _chessPieces.QueenPiece(this, 31));
        this.addBlackPiece(this.blackKing = new _chessPieces.KingPiece(this, 39));
        this.addBlackPiece(new _chessPieces.BishopPiece(this, 47));
        this.addBlackPiece(new _chessPieces.KnightPiece(this, 55));
        this.addBlackPiece(new _chessPieces.RookPiece(this, 63));
        //폰 배치
        this.addBlackPiece(new _chessPieces.PawnPiece(this, 6));
        this.addBlackPiece(new _chessPieces.PawnPiece(this, 14));
        this.addBlackPiece(new _chessPieces.PawnPiece(this, 22));
        this.addBlackPiece(new _chessPieces.PawnPiece(this, 30));
        this.addBlackPiece(new _chessPieces.PawnPiece(this, 38));
        this.addBlackPiece(new _chessPieces.PawnPiece(this, 46));
        this.addBlackPiece(new _chessPieces.PawnPiece(this, 54));
        this.addBlackPiece(new _chessPieces.PawnPiece(this, 62));

        //백 피스 배치
        this.addWhitePiece(new _chessPieces.RookPiece(this, 0));
        this.addWhitePiece(new _chessPieces.KnightPiece(this, 8));
        this.addWhitePiece(new _chessPieces.BishopPiece(this, 16));
        this.addWhitePiece(new _chessPieces.QueenPiece(this, 24));
        this.addWhitePiece(this.whiteKing = new _chessPieces.KingPiece(this, 32));
        this.addWhitePiece(new _chessPieces.BishopPiece(this, 40));
        this.addWhitePiece(new _chessPieces.KnightPiece(this, 48));
        this.addWhitePiece(new _chessPieces.RookPiece(this, 56));
        //폰 배치
        this.addWhitePiece(new _chessPieces.PawnPiece(this, 1));
        this.addWhitePiece(new _chessPieces.PawnPiece(this, 9));
        this.addWhitePiece(new _chessPieces.PawnPiece(this, 17));
        this.addWhitePiece(new _chessPieces.PawnPiece(this, 25));
        this.addWhitePiece(new _chessPieces.PawnPiece(this, 33));
        this.addWhitePiece(new _chessPieces.PawnPiece(this, 41));
        this.addWhitePiece(new _chessPieces.PawnPiece(this, 49));
        this.addWhitePiece(new _chessPieces.PawnPiece(this, 57));
    }

    addWhitePiece(piece) {
        this.boardPieces.push(piece);
        this.whitePieces.push(piece);
    }

    addBlackPiece(piece) {
        this.boardPieces.push(piece);
        this.blackPieces.push(piece);
    }
}
exports.default = ChessBoard;