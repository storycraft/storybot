
//보드판 렌더러

import fs from 'fs';
import Canvas, { Image } from 'canvas-prebuilt';

//https://commons.wikimedia.org/wiki/File:Chess_Pieces_Sprite.svg
const PIECE_SOURCE_PATH = './resources/chess_pieces.png';

const PIECE_BLACK = 0;
const PIECE_WHITE = 1;

export default class BoardRenderer {
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
                    this.ctx.fillRect(2 + x * 37,2 + y * 37, 37, 37);
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