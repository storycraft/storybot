import { PawnPiece, RookPiece, KnightPiece, BishopPiece, KingPiece, QueenPiece } from './chess-pieces';

/*
 * 체스판은 8 x 8의 게임판에서 진행되는 2인 제로섬 유한 확정 완전정보 게임 입니다
 * https://namu.wiki/w/체스
 */
export default class ChessBoard {
    constructor(game){
        this.game = game;

        this.boardPieces = [];

        this.blackPieces = [];
        this.whitePieces = [];

        this.blackKing = null;
        this.whiteKing = null;

        this.deadPieces = [];

        this.createDefault();
    }

    get BoardPieces(){
        return this.boardPieces;
    }

    get BlackPieces(){
        return this.blackPieces;
    }

    get WhitePieces(){
        return this.whitePieces;
    }

    get DeadPieces(){
        return this.deadPieces;
    }

    get BlackKingDied(){
        return !this.DeadPieces.includes(this.blackKing);
    }

    get WhiteKingDead(){
        return !this.DeadPieces.includes(this.whiteKing);
    }

    get IsGameOver(){
        return this.BlackKingDied || this.WhiteKingDead;
    }

    getPieceAt(location){
        for (let piece of this.boardPieces){
            if (piece.Location == location)
                return piece;
        }

        return null;
    }

    movePieceTo(piece, location){
        var enemyPieces = null;
        if (this.WhitePieces.includes(piece))
            enemyPieces = this.BlackPieces;
        else if (this.BlackPieces.includes(piece))
            enemyPieces = this.WhitePieces;
        else
            throw new Error('알수 없는 체스 말 입니다');

        var arrPiece = this.getPieceAt(location);
        if (arrPiece && enemyPieces.includes(arrPiece)){
            enemyPieces.splice(enemyPieces.indexOf(arrPiece), 1);
            this.deadPieces.push(arrPiece);
        }

        piece.Location = location;
    }

    createDefault(){
        //흑 피스 배치
        this.addBlackPiece(new RookPiece(this, 0));
        this.addBlackPiece(new KnightPiece(this, 8));
        this.addBlackPiece(new BishopPiece(this, 16));
        this.addBlackPiece(new QueenPiece(this, 24));
        this.addBlackPiece(this.blackKing = new KingPiece(this, 32));
        this.addBlackPiece(new BishopPiece(this, 40));
        this.addBlackPiece(new KnightPiece(this,48));
        this.addBlackPiece(new RookPiece(this, 56));
        //폰 배치
        this.addBlackPiece(new PawnPiece(this, 1));
        this.addBlackPiece(new PawnPiece(this, 9));
        this.addBlackPiece(new PawnPiece(this, 17));
        this.addBlackPiece(new PawnPiece(this, 25));
        this.addBlackPiece(new PawnPiece(this, 33));
        this.addBlackPiece(new PawnPiece(this, 41));
        this.addBlackPiece(new PawnPiece(this, 49));
        this.addBlackPiece(new PawnPiece(this, 57));

        //백 피스 배치
        this.addWhitePiece(new RookPiece(this, 7));
        this.addWhitePiece(new KnightPiece(this, 15));
        this.addWhitePiece(new BishopPiece(this, 23));
        this.addWhitePiece(new QueenPiece(this, 31));
        this.addWhitePiece(this.whiteKing = new KingPiece(this, 39));
        this.addWhitePiece(new BishopPiece(this, 47));
        this.addWhitePiece(new KnightPiece(this, 55));
        this.addWhitePiece(new RookPiece(this, 63));
        //폰 배치
        this.addWhitePiece(new PawnPiece(this, 6));
        this.addWhitePiece(new PawnPiece(this, 14));
        this.addWhitePiece(new PawnPiece(this, 22));
        this.addWhitePiece(new PawnPiece(this, 30));
        this.addWhitePiece(new PawnPiece(this, 38));
        this.addWhitePiece(new PawnPiece(this, 46));
        this.addWhitePiece(new PawnPiece(this, 54));
        this.addWhitePiece(new PawnPiece(this, 62));
    }

    addWhitePiece(piece){
        this.boardPieces.push(piece);
        this.whitePieces.push(piece);
    }

    addBlackPiece(piece){
        this.boardPieces.push(piece);
        this.blackPieces.push(piece);
    }
}