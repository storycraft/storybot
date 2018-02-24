import Game from '../game';

import fs from 'fs';
import Canvas, { Image } from 'canvas-prebuilt';
import { MessageTemplate, MessageAttachment } from 'storybot-core';

export default class ChessGame extends Game {
    constructor(playChannel){
        super(playChannel);

        this.gameboard = new ChessBoard(this);
        this.boardRenderer = new BoardRenderer(this.gameboard);

        this.currentTurn = 0;

        this.statusMessage = '';

        this.commandBind = this.onMoveCommand.bind(this);
    }

    get BlackPlayer(){
        return this.PlayerList[0];
    }

    get WhitePlayer(){
        return this.PlayerList[1];
    }

    set BlackPlayer(user){
        this.PlayerList[0] = user;
    }

    set WhitePlayer(user){
        this.PlayerList[1] = user;
    }

    get CurrentTurn(){
        return this.currentTurn;
    }

    setNextTurn(){
        return this.currentTurn = (this.currentTurn ? 0/*Black*/ : 1/*White*/);
    }

    get CurrentPlayer(){
        return this.PlayerList[this.CurrentTurn];
    }

    get StatusMessage(){
        return this.statusMessage;
    }

    get FirebaseDbRef(){
        if (this.gameManager)
            return this.gameManager.FirebaseGameDb.child('chess');
        
        return null;
    }

    async getPlayerStat(player){
        var firebaseDbRef = this.FirebaseDbRef;

        var data = {
            'win': 0,
            'lose': 0,
            'draw': 0
        }

        if (firebaseDbRef){
            var snapshotData = await FirebaseDbRef.child(player.Id).once('value');

            if (snapshotData.exists()){
                data['win'] = snapshotData.child('win').val();
                data['lose'] = snapshotData.child('lose').val();
                data['draw'] = snapshotData.child('draw').val();
            }
        }

        return data;
    }

    async updatePlayerStat(player, win, lose, draw){
        FirebaseDbRef.child(player.Id).set({
            'win': win,
            'lose': lose,
            'draw': draw
        });
    }

    start(gameManager){
        if (this.PlayerList.length != 2)
            throw new Error('플레이어 수는 2명이어야 합니다');

        super.start(gameManager);

        this.statusMessage = `\`${this.BlackPlayer.Name}\`와 \`${this.WhitePlayer.Name}\`의 체스가 시작 되었습니다`;

        this.gameManager.Main.CommandManager.on('move', this.commandBind);

        this.sendInfoMessages();
    }

    onMoveCommand(args, user, bot, source){
        if (source != this.PlayChannel || !this.PlayerList.includes(user))
            return;

        if (this.CurrentPlayer != user){
            source.send('님 차례 아닌데요?');
            return;
        }
        else if (args.length != 2){
            source.send('사용법: *move <말의 위치> <이동 할 위치>\nEx) *move a1 a3');
            return;
        }

        try{
            var firstX = Math.abs(args[0][0].toLowerCase().charCodeAt(0) - 97/*소문자 a 키 코드*/);//입력된 문자에서 a 키 코드 값을 빼서 위치를 구함
            var firstY = Number.parseInt(args[0][1]) - 1;//배열은 0부터 시작하니 1씩 빼줍시다
            
            var secX = Math.abs(args[1][0].toLowerCase().charCodeAt(0) - 97);
            var secY = Number.parseInt(args[1][1]) - 1;

            if (firstX > 7 || firstY > 7 || secX > 7 || secY > 7)
                throw new Error('숫자의 범위가 잘못 되었습니다 허용 범위 (1 ~ 8)');

            var piece = this.gameboard.getPieceAt(BoardMathHelper.getCombinedLocation(firstX, firstY));

            if (!piece){
                source.send('거기 아무 말도 없는데요');
                return;
            }

            if (this.CurrentTurn == 0 && this.gameboard.WhitePieces.includes(piece)
                || this.CurrentTurn == 1 && this.gameboard.BlackPieces.includes(piece)){
                    source.send('그거 님 말 아니지 않나요?');
                    return;
                }

            var combinedMovePos = BoardMathHelper.getCombinedLocation(secX, secY);
            if (piece.canMoveTo(this.gameboard, combinedMovePos)){
                this.gameboard.movePieceTo(piece, combinedMovePos);

                this.setNextTurn();

                this.statusMessage = `\`${user.Name}\`의 차례입니다`;
                this.sendInfoMessages();
            }
            else{
                source.send('그 말은 거기로 못 움직입니다');
            }

        } catch(e){
            source.send('올바른 형식으로 입력해 주세요\nEx) *move a1 a3');
            return;
        }
    }

    async sendInfoMessages(){
        try{
            await this.boardRenderer.init();
        
            var messageTemplate = new MessageTemplate(this.statusMessage, [ new MessageAttachment('chess-board.png', await this.boardRenderer.render()) ]);

            this.PlayChannel.send(messageTemplate);
        } catch (e){
            this.PlayChannel.send(`작업 진행중 오류가 발생했습니다\n${e}`);
        }
    }

    stop(){
        super.stop();

        this.gameManager.Main.CommandManager.removeListener('move', this.commandBind);

        var winner = null;
        if (this.gameboard.BlackKingDied && !this.gameboard.WhiteKingDead){
            winner = this.WhitePlayer;
        }
        else if (this.gameboard.WhiteKingDead && !this.gameboard.BlackKingDied){
            winner = this.BlackPlayer;
        }

        if (winner){
            this.statusMessage = `게임이 종료 되었습니다 \`${winner.Name}\`이(가) 승리했습니다`;
        }
        else{
            this.statusMessage = `게임이 중단 되었습니다 \`${this.BlackPlayer.Name}\`과 \`${this.WhitePlayer.Name}\`이 비겼습니다`;
        }
    }
}

/*
 * 체스판은 8 x 8의 게임판에서 진행되는 2인 제로섬 유한 확정 완전정보 게임 입니다
 * https://namu.wiki/w/체스
 */
class ChessBoard {
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
        return this.DeadPieces.includes(this.blackKing);
    }

    get WhiteKingDead(){
        return this.DeadPieces.includes(this.whiteKing);
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
        this.addBlackPiece(new RookPiece(this, 7));
        this.addBlackPiece(new KnightPiece(this, 15));
        this.addBlackPiece(new BishopPiece(this, 23));
        this.addBlackPiece(new QueenPiece(this, 31));
        this.addBlackPiece(this.blackKing = new KingPiece(this, 39));
        this.addBlackPiece(new BishopPiece(this, 47));
        this.addBlackPiece(new KnightPiece(this, 55));
        this.addBlackPiece(new RookPiece(this, 63));
        //폰 배치
        this.addBlackPiece(new PawnPiece(this, 6));
        this.addBlackPiece(new PawnPiece(this, 14));
        this.addBlackPiece(new PawnPiece(this, 22));
        this.addBlackPiece(new PawnPiece(this, 30));
        this.addBlackPiece(new PawnPiece(this, 38));
        this.addBlackPiece(new PawnPiece(this, 46));
        this.addBlackPiece(new PawnPiece(this, 54));
        this.addBlackPiece(new PawnPiece(this, 62));

        //백 피스 배치
        this.addWhitePiece(new RookPiece(this, 0));
        this.addWhitePiece(new KnightPiece(this, 8));
        this.addWhitePiece(new BishopPiece(this, 16));
        this.addWhitePiece(new QueenPiece(this, 24));
        this.addWhitePiece(this.whiteKing = new KingPiece(this, 32));
        this.addWhitePiece(new BishopPiece(this, 40));
        this.addWhitePiece(new KnightPiece(this,48));
        this.addWhitePiece(new RookPiece(this, 56));
        //폰 배치
        this.addWhitePiece(new PawnPiece(this, 1));
        this.addWhitePiece(new PawnPiece(this, 9));
        this.addWhitePiece(new PawnPiece(this, 17));
        this.addWhitePiece(new PawnPiece(this, 25));
        this.addWhitePiece(new PawnPiece(this, 33));
        this.addWhitePiece(new PawnPiece(this, 41));
        this.addWhitePiece(new PawnPiece(this, 49));
        this.addWhitePiece(new PawnPiece(this, 57));
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

class ChessPiece {
    constructor(board, location){
        this.board = board;

        this.drawable = null;

        this.location = location;
    }

    get Board(){
        return this.board;
    }

    get Location(){
        return this.location;
    }

    get Score(){
        return 0;
    }

    get Drawable(){
        return this.drawable;
    }

    set Location(loc){
        this.location = loc;
    }

    canMoveTo(board, location){
        return location != this.Location;
    }
}

//https://commons.wikimedia.org/wiki/File:Chess_Pieces_Sprite.svg
const PIECE_SOURCE_PATH = './resources/chess_pieces.png';

const PIECE_SOURCE_SIZE = [45, 45];
const PIECE_SOURCE_OFFSET = 0;

const PIECE_SIZE = 37;

// Y offset
const PIECE_BLACK = 0;
const PIECE_WHITE = 1;

// X offset
const PIECE_PAWN = 5;
const PIECE_ROOK = 4;
const PIECE_KNIGHT = 3;
const PIECE_BISHOP = 2;
const PIECE_QUEEN = 1;
const PIECE_KING = 0;

class PieceDrawable {
    constructor(piece){
        this.piece = piece;
    }

    get Piece(){
        return this.piece;
    }

    draw(ctx, pieceImage, color){

    }
}

/////
///// 체스말 클래스들 선언
/////

class PawnPiece extends ChessPiece {
    constructor(board, location){
        super(board, location);

        super.drawable = new PawnDrawable(this);

        this.default = true;
    }

    get NeedPathCheck(){
        return true;
    }

    get Score(){
        return 1;
    }

    get Location(){
        return super.Location;
    }

    set Location(location){
        if (this.default)
            this.default = false;

        super.Location = location;
    }

    //폰의 경우 말 처 먹을 수 있는것 빼고 모두 계산함
    canMoveTo(board, location){
        if (!super.canMoveTo(location))
            return false;
        
        let loc = BoardMathHelper.fromCombinedLocation(super.Location);
        let to = BoardMathHelper.fromCombinedLocation(location);

        if (this.default && (to[1] - loc[1]) == 2)
            return true;
        
        if ((to[1] - loc[1]) == 1)
            return true;

        return false;
    }
}

class PawnDrawable extends PieceDrawable {
    constructor(piece){
        super(piece);
    }

    draw(ctx, pieceImage, color){
        var loc = BoardMathHelper.fromCombinedLocation(this.Piece.Location);

        ctx.drawImage(pieceImage, (PIECE_SOURCE_SIZE[0] + PIECE_SOURCE_OFFSET) * PIECE_PAWN, color * PIECE_SOURCE_SIZE[1], PIECE_SOURCE_SIZE[0], PIECE_SOURCE_SIZE[1], 
        loc[0] * PIECE_SIZE, loc[1] * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);
    }
}

class RookPiece extends ChessPiece {
    constructor(board, location){
        super(board, location);

        super.drawable = new RookDrawable(this);
    }

    get Score(){
        return 5;
    }

    canMoveTo(board, location){
        if (!super.canMoveTo(location))
            return false;

        let loc = BoardMathHelper.fromCombinedLocation(this.Location);
        let to = BoardMathHelper.fromCombinedLocation(location);

        return loc[0] == to[0] || loc[1] == to[1];
    }
}

class RookDrawable extends PieceDrawable {
    constructor(piece){
        super(piece);
    }

    draw(ctx, pieceImage, color){
        var loc = BoardMathHelper.fromCombinedLocation(this.Piece.Location);
        ctx.drawImage(pieceImage, (PIECE_SOURCE_SIZE[0] + PIECE_SOURCE_OFFSET) * PIECE_ROOK, color * PIECE_SOURCE_SIZE[1], PIECE_SOURCE_SIZE[0], PIECE_SOURCE_SIZE[1], 
        loc[0] * PIECE_SIZE, loc[1] * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);
    }
}

class BishopPiece extends ChessPiece {
    constructor(board, location){
        super(board, location);

        super.drawable = new BishopDrawable(this);
    }

    get Score(){
        return 3;
    }

    canMoveTo(board, location){
        if (!super.canMoveTo(location))
            return false;

        let loc = BoardMathHelper.fromCombinedLocation(super.Location);
        let to = BoardMathHelper.fromCombinedLocation(location);

        return (loc[0] - to[0]) == (loc[1] - to[1]);
    }
}

class BishopDrawable extends PieceDrawable {
    constructor(piece){
        super(piece);
    }

    draw(ctx, pieceImage, color){
        var loc = BoardMathHelper.fromCombinedLocation(this.Piece.Location);
        ctx.drawImage(pieceImage, (PIECE_SOURCE_SIZE[0] + PIECE_SOURCE_OFFSET) * PIECE_BISHOP, color * PIECE_SOURCE_SIZE[1], PIECE_SOURCE_SIZE[0], PIECE_SOURCE_SIZE[1], 
        loc[0] * PIECE_SIZE, loc[1] * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);
    }
}

class KnightPiece extends ChessPiece {
    constructor(board, location){
        super(board, location);

        super.drawable = new KnightDrawable(this);
    }

    get Score(){
        return 3;
    }

    get NeedPathCheck(){
        return false;
    }

    canMoveTo(board, location){
        if (!super.canMoveTo(location))
            return false;

        let loc = BoardMathHelper.fromCombinedLocation(super.Location);
        let to = BoardMathHelper.fromCombinedLocation(location);

        var x = Math.abs(to[0] - loc[0]);
        var y = Math.abs(to[1] - loc[1]);

        return x && y && x + y == 3;
    }
}

class KnightDrawable extends PieceDrawable {
    constructor(piece){
        super(piece);
    }

    draw(ctx, pieceImage, color){
        var loc = BoardMathHelper.fromCombinedLocation(this.Piece.Location);
        ctx.drawImage(pieceImage, (PIECE_SOURCE_SIZE[0] + PIECE_SOURCE_OFFSET) * PIECE_KNIGHT, color * PIECE_SOURCE_SIZE[1], PIECE_SOURCE_SIZE[0], PIECE_SOURCE_SIZE[1], 
        loc[0] * PIECE_SIZE, loc[1] * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);
    }
}

class KingPiece extends ChessPiece {
    constructor(board, location){
        super(board, location);

        super.drawable = new KingDrawable(this);
    }

    canMoveTo(board, location){
        if (!super.canMoveTo(location))
            return false;

        let loc = BoardMathHelper.fromCombinedLocation(super.Location);
        let to = BoardMathHelper.fromCombinedLocation(location);

        var x = Math.abs(to[0] - loc[0]);
        var y = Math.abs(to[1] - loc[1]);

        return (x == 0 && y == 1) || (x == 1 && y == 0) || (x == 1 && y == 1);
    }
}

class KingDrawable extends PieceDrawable {
    constructor(piece){
        super(piece);
    }

    draw(ctx, pieceImage, color){
        var loc = BoardMathHelper.fromCombinedLocation(this.Piece.Location);
        ctx.drawImage(pieceImage, (PIECE_SOURCE_SIZE[0] + PIECE_SOURCE_OFFSET) * PIECE_KING, color * PIECE_SOURCE_SIZE[1], PIECE_SOURCE_SIZE[0], PIECE_SOURCE_SIZE[1], 
        loc[0] * PIECE_SIZE, loc[1] * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);
    }
}

class QueenPiece extends ChessPiece {
    constructor(board, location){
        super(board, location);

        super.drawable = new QueenDrawable(this);
    }

    get Score(){
        return 9;
    }

    canMoveTo(board, location){
        if (!super.canMoveTo(location))
            return false;

            var x = Math.abs(to[0] - loc[0]);
            var y = Math.abs(to[1] - loc[1]);

        return (x == y) || (x == 0) || (y == 0);
    }
}

class QueenDrawable extends PieceDrawable {
    constructor(piece){
        super(piece);
    }

    draw(ctx, pieceImage, color){
        var loc = BoardMathHelper.fromCombinedLocation(this.Piece.Location);
        ctx.drawImage(pieceImage, (PIECE_SOURCE_SIZE[0] + PIECE_SOURCE_OFFSET) * PIECE_QUEEN, color * PIECE_SOURCE_SIZE[1], PIECE_SOURCE_SIZE[0], PIECE_SOURCE_SIZE[1], 
        loc[0] * PIECE_SIZE, loc[1] * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);
    }
}

//계산용 util
class BoardMathHelper {

    static getCombinedLocation(x, y){
        return x << 3 | y;
    }

    static fromCombinedLocation(xy){
        return [xy >> 3, xy & 7];
    }

    static distance(loc1, loc2){
        let from = BoardMathHelper.fromCombinedLocation(loc1);
        let to = BoardMathHelper.fromCombinedLocation(loc2);

        return Math.sqrt(Math.pow(from[0] - to[0], 2) + Math.pow(from[1] - to[1], 2));
    }
}

//보드판 렌더러

class BoardRenderer {
    constructor(board){
        this.board = board;

        //디스코드 pc 미리보기 최대 크기
        this.canvas = new Canvas(300, 300);

        this.pieceBuffer = null;

        this.ctx = this.canvas.getContext("2d");
    }

    get Board(){
        return this.board;
    }

    async init(){
        let readQueue = new Promise((resolve, reject) => fs.readFile(PIECE_SOURCE_PATH, (err, data) => {
            if (err) return reject(err);

            resolve(data);
        }));

        try {
            this.pieceImage = new Image();
            this.pieceImage.src = await readQueue;
        } catch(e){
            console.log(`체스 피스 파일 로딩중 오류가 발생했습니다\n${e}`);
        }
    }

    drawBackground(){
        this.ctx.fillStyle = 'rgb(118, 150, 86)';

        this.ctx.fillRect(0, 0, 300, 300);

        this.ctx.fillStyle = 'rgb(238, 238, 210)';
        
        for (let x = 0; x < 8; x++){
            for (let y = 0; y < 8; y++){
                if ((x + y) % 2 == 1)
                    this.ctx.fillRect(2 + x * PIECE_SIZE,2 + y * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);
            }
        }
    }

    async render(){
        this.drawBackground();
        this.ctx.translate(2, 2);

        for (var blackPiece of this.Board.BlackPieces){
            this.drawPiece(blackPiece, PIECE_BLACK);
        }

        for (var whitePiece of this.Board.WhitePieces){
            this.drawPiece(whitePiece, PIECE_WHITE);
        }

        this.ctx.translate(-2, -2);

        return new Promise((resolve, reject) => {
            this.canvas.toBuffer((err, buf) => {
                if (err)
                    reject(err);
                
                resolve(buf);
            });
        });
    }
    
    drawPiece(piece, color){
        piece.Drawable.draw(this.ctx, this.pieceImage, color);
    }
}