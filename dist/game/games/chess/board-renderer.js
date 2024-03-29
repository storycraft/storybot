'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _canvasPrebuilt = require('canvas-prebuilt');

var _canvasPrebuilt2 = _interopRequireDefault(_canvasPrebuilt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//https://commons.wikimedia.org/wiki/File:Chess_Pieces_Sprite.svg

//보드판 렌더러

const PIECE_SOURCE_PATH = './resources/chess_pieces.png';

const BOARD_SIZE = 300;

// Y offset
const PIECE_SOURCE_BLACK = 1;
const PIECE_SOURCE_WHITE = 0;

class BoardRenderer {
    constructor(board) {
        this.board = board;

        //디스코드 pc 미리보기 최대 크기
        this.canvas = new _canvasPrebuilt2.default(BOARD_SIZE, BOARD_SIZE);

        this.pieceBuffer = null;

        this.ctx = this.canvas.getContext("2d");
    }

    get Board() {
        return this.board;
    }

    async init() {
        let readQueue = new Promise((resolve, reject) => _fs2.default.readFile(PIECE_SOURCE_PATH, (err, data) => {
            if (err) return reject(err);

            resolve(data);
        }));

        try {
            this.pieceImage = new _canvasPrebuilt.Image();
            this.pieceImage.src = await readQueue;
        } catch (e) {
            console.log(`체스 피스 파일 로딩중 오류가 발생했습니다\n${e}`);
        }
    }

    drawBackground() {
        this.ctx.fillStyle = 'rgb(118, 150, 86)';

        this.ctx.fillRect(0, 0, 300, 300);

        this.ctx.fillStyle = 'rgb(238, 238, 210)';

        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                if ((x + y) % 2 == 1) this.ctx.fillRect(2 + x * 37, 2 + y * 37, 37, 37);
            }
        }
    }

    async render() {
        this.drawBackground();
        this.ctx.translate(2, 2);

        for (var blackPiece of this.Board.BlackPieces) {
            this.drawPiece(blackPiece, PIECE_SOURCE_BLACK);
        }

        for (var whitePiece of this.Board.WhitePieces) {
            this.drawPiece(whitePiece, PIECE_SOURCE_WHITE);
        }

        this.ctx.translate(-2, -2);

        return new Promise((resolve, reject) => {
            this.canvas.toBuffer((err, buf) => {
                if (err) reject(err);

                resolve(buf);
            });
        });
    }

    drawPiece(piece, color) {
        piece.Drawable.draw(this.ctx, this.pieceImage, color);
    }
}
exports.default = BoardRenderer;