'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.QueenPiece = exports.KingPiece = exports.KnightPiece = exports.BishopPiece = exports.RookPiece = exports.PawnPiece = undefined;

var _boardMathHelper = require('./board-math-helper');

var _boardMathHelper2 = _interopRequireDefault(_boardMathHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ChessPiece {
    constructor(board, location) {
        this.board = board;

        this.drawable = null;

        this.location = location;
    }

    get Board() {
        return this.board;
    }

    get Location() {
        return this.location;
    }

    get Score() {
        return 0;
    }

    get Drawable() {
        return this.drawable;
    }

    set Location(loc) {
        this.location = loc;
    }

    canMoveTo(location) {
        let piece = this.Board.getPieceAt(location);

        if (!piece) return true;

        let teamPieces = this.Board.WhitePieces.includes(this) ? this.Board.WhitePieces : this.Board.BlackPieces;

        return !teamPieces.includes(piece);
    }
}

const PIECE_SOURCE_SIZE = [45, 45];
const PIECE_SOURCE_OFFSET = 0;

const PIECE_SIZE = 37;

// X offset
const PIECE_PAWN = 5;
const PIECE_ROOK = 4;
const PIECE_KNIGHT = 3;
const PIECE_BISHOP = 2;
const PIECE_QUEEN = 1;
const PIECE_KING = 0;

class PieceDrawable {
    constructor(piece) {
        this.piece = piece;
    }

    get Piece() {
        return this.piece;
    }

    draw(ctx, pieceImage, color) {}
}

/////
///// 체스말 클래스들 선언
/////

class PawnPiece extends ChessPiece {
    constructor(board, location) {
        super(board, location);

        super.drawable = new PawnDrawable(this);

        this.default = true;
    }

    get NeedPathCheck() {
        return true;
    }

    get Score() {
        return 1;
    }

    get Location() {
        return super.Location;
    }

    set Location(location) {
        if (this.default) this.default = false;

        super.Location = location;
    }

    canMoveTo(location) {
        if (!super.canMoveTo(location)) return false;

        let loc = _boardMathHelper2.default.fromCombinedLocation(super.Location);
        let to = _boardMathHelper2.default.fromCombinedLocation(location);

        let offX = to[0] - loc[0];
        let offY = to[1] - loc[1];

        let direction = this.Board.WhitePieces.includes(this) ? -1 /*하얀 폰 일 경우 아래 방향*/ : 1 /*검은 폰 일 경우 윗 방향*/;
        let targetPiece = super.Board.getPieceAt(location);

        if (offX == 0 && !targetPiece) {
            if (this.default && offY == direction * 2) return true;

            if (offY == direction) return true;
        } else if (offY == direction && targetPiece && Math.abs(offX) == 1) return true;

        return false;
    }
}

exports.PawnPiece = PawnPiece;
class RookPiece extends ChessPiece {
    constructor(board, location) {
        super(board, location);

        super.drawable = new RookDrawable(this);
    }

    get Score() {
        return 5;
    }

    canMoveTo(location) {
        if (!super.canMoveTo(location)) return false;

        let loc = _boardMathHelper2.default.fromCombinedLocation(this.Location);
        let to = _boardMathHelper2.default.fromCombinedLocation(location);

        let xOff = to[0] - loc[0];
        let yOff = to[1] - loc[1];

        if (xOff && yOff) return false;

        //위 아래로만 움직일 경우
        if (!xOff) {
            var distance = Math.abs(yOff);
            var dirY = yOff / distance;

            for (let i = 1; i < distance; i++) {
                if (super.Board.getPieceAt(_boardMathHelper2.default.getCombinedLocation(loc[0], loc[1] + dirY * i))) return false;
            }
        } //왼쪽 오른쪽으로만 움직일 경우
        else {
                var distance = Math.abs(xOff);
                var dirX = xOff / distance;

                for (let i = 1; i < distance; i++) {
                    if (super.Board.getPieceAt(_boardMathHelper2.default.getCombinedLocation(loc[0] + dirX * i, loc[1]))) return false;
                }
            }

        return true;
    }
}

exports.RookPiece = RookPiece;
class BishopPiece extends ChessPiece {
    constructor(board, location) {
        super(board, location);

        super.drawable = new BishopDrawable(this);
    }

    get Score() {
        return 3;
    }

    canMoveTo(location) {
        if (!super.canMoveTo(location)) return false;

        let loc = _boardMathHelper2.default.fromCombinedLocation(super.Location);
        let to = _boardMathHelper2.default.fromCombinedLocation(location);

        let offX = to[0] - loc[0];
        let offY = to[1] - loc[1];

        if (Math.abs(offX) != Math.abs(offY)) return false;

        var distance = Math.abs(offX);

        var direX = offX / distance;
        var direY = offY / distance;

        for (let i = 1; i < distance; i++) {
            if (super.Board.getPieceAt(_boardMathHelper2.default.getCombinedLocation(loc[0] + direX * i, loc[1] + direY * i))) return false;
        }

        return true;
    }
}

exports.BishopPiece = BishopPiece;
class KnightPiece extends ChessPiece {
    constructor(board, location) {
        super(board, location);

        super.drawable = new KnightDrawable(this);
    }

    get Score() {
        return 3;
    }

    get NeedPathCheck() {
        return false;
    }

    canMoveTo(location) {
        if (!super.canMoveTo(location)) return false;

        let loc = _boardMathHelper2.default.fromCombinedLocation(super.Location);
        let to = _boardMathHelper2.default.fromCombinedLocation(location);

        var x = Math.abs(to[0] - loc[0]);
        var y = Math.abs(to[1] - loc[1]);

        return x && y && x + y == 3;
    }
}

exports.KnightPiece = KnightPiece;
class KingPiece extends ChessPiece {
    constructor(board, location) {
        super(board, location);

        super.drawable = new KingDrawable(this);
    }

    canMoveTo(location) {
        if (!super.canMoveTo(location)) return false;

        let loc = _boardMathHelper2.default.fromCombinedLocation(super.Location);
        let to = _boardMathHelper2.default.fromCombinedLocation(location);

        var x = Math.abs(to[0] - loc[0]);
        var y = Math.abs(to[1] - loc[1]);

        return x == 0 && y == 1 || x == 1 && y == 0 || x == 1 && y == 1;
    }
}

exports.KingPiece = KingPiece;
class QueenPiece extends ChessPiece {
    constructor(board, location) {
        super(board, location);

        super.drawable = new QueenDrawable(this);
    }

    get Score() {
        return 9;
    }

    canMoveTo(location) {
        return new RookPiece(super.Board, this.Location).canMoveTo(location) || new BishopPiece(super.Board, this.Location).canMoveTo(location);
    }
}

exports.QueenPiece = QueenPiece;
class PawnDrawable extends PieceDrawable {
    constructor(piece) {
        super(piece);
    }

    draw(ctx, pieceImage, color) {
        var loc = _boardMathHelper2.default.fromCombinedLocation(this.Piece.Location);

        ctx.drawImage(pieceImage, (PIECE_SOURCE_SIZE[0] + PIECE_SOURCE_OFFSET) * PIECE_PAWN, color * PIECE_SOURCE_SIZE[1], PIECE_SOURCE_SIZE[0], PIECE_SOURCE_SIZE[1], loc[0] * PIECE_SIZE, /*위치가 반대이므로 뒤집어줌*/(7 - loc[1]) * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);
    }
}

class RookDrawable extends PieceDrawable {
    constructor(piece) {
        super(piece);
    }

    draw(ctx, pieceImage, color) {
        var loc = _boardMathHelper2.default.fromCombinedLocation(this.Piece.Location);
        ctx.drawImage(pieceImage, (PIECE_SOURCE_SIZE[0] + PIECE_SOURCE_OFFSET) * PIECE_ROOK, color * PIECE_SOURCE_SIZE[1], PIECE_SOURCE_SIZE[0], PIECE_SOURCE_SIZE[1], loc[0] * PIECE_SIZE, (7 - loc[1]) * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);
    }
}

class BishopDrawable extends PieceDrawable {
    constructor(piece) {
        super(piece);
    }

    draw(ctx, pieceImage, color) {
        var loc = _boardMathHelper2.default.fromCombinedLocation(this.Piece.Location);
        ctx.drawImage(pieceImage, (PIECE_SOURCE_SIZE[0] + PIECE_SOURCE_OFFSET) * PIECE_BISHOP, color * PIECE_SOURCE_SIZE[1], PIECE_SOURCE_SIZE[0], PIECE_SOURCE_SIZE[1], loc[0] * PIECE_SIZE, (7 - loc[1]) * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);
    }
}

class KnightDrawable extends PieceDrawable {
    constructor(piece) {
        super(piece);
    }

    draw(ctx, pieceImage, color) {
        var loc = _boardMathHelper2.default.fromCombinedLocation(this.Piece.Location);
        ctx.drawImage(pieceImage, (PIECE_SOURCE_SIZE[0] + PIECE_SOURCE_OFFSET) * PIECE_KNIGHT, color * PIECE_SOURCE_SIZE[1], PIECE_SOURCE_SIZE[0], PIECE_SOURCE_SIZE[1], loc[0] * PIECE_SIZE, (7 - loc[1]) * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);
    }
}

class KingDrawable extends PieceDrawable {
    constructor(piece) {
        super(piece);
    }

    draw(ctx, pieceImage, color) {
        var loc = _boardMathHelper2.default.fromCombinedLocation(this.Piece.Location);
        ctx.drawImage(pieceImage, (PIECE_SOURCE_SIZE[0] + PIECE_SOURCE_OFFSET) * PIECE_KING, color * PIECE_SOURCE_SIZE[1], PIECE_SOURCE_SIZE[0], PIECE_SOURCE_SIZE[1], loc[0] * PIECE_SIZE, (7 - loc[1]) * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);
    }
}

class QueenDrawable extends PieceDrawable {
    constructor(piece) {
        super(piece);
    }

    draw(ctx, pieceImage, color) {
        var loc = _boardMathHelper2.default.fromCombinedLocation(this.Piece.Location);
        ctx.drawImage(pieceImage, (PIECE_SOURCE_SIZE[0] + PIECE_SOURCE_OFFSET) * PIECE_QUEEN, color * PIECE_SOURCE_SIZE[1], PIECE_SOURCE_SIZE[0], PIECE_SOURCE_SIZE[1], loc[0] * PIECE_SIZE, (7 - loc[1]) * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);
    }
}