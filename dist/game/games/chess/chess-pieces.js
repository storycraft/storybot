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

    canMoveTo(board, location) {
        return location != this.Location;
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

    //폰의 경우 말 처 먹을 수 있는것 빼고 모두 계산함
    canMoveTo(board, location) {
        if (!super.canMoveTo(location)) return false;

        let loc = _boardMathHelper2.default.fromCombinedLocation(super.Location);
        let to = _boardMathHelper2.default.fromCombinedLocation(location);

        if (this.default && to[1] - loc[1] == 2) return true;

        if (to[1] - loc[1] == 1) return true;

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

    canMoveTo(board, location) {
        if (!super.canMoveTo(location)) return false;

        let loc = _boardMathHelper2.default.fromCombinedLocation(this.Location);
        let to = _boardMathHelper2.default.fromCombinedLocation(location);

        return loc[0] == to[0] || loc[1] == to[1];
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

    canMoveTo(board, location) {
        if (!super.canMoveTo(location)) return false;

        let loc = _boardMathHelper2.default.fromCombinedLocation(super.Location);
        let to = _boardMathHelper2.default.fromCombinedLocation(location);

        return loc[0] - to[0] == loc[1] - to[1];
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

    canMoveTo(board, location) {
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

    canMoveTo(board, location) {
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

    canMoveTo(board, location) {
        if (!super.canMoveTo(location)) return false;

        var x = Math.abs(to[0] - loc[0]);
        var y = Math.abs(to[1] - loc[1]);

        return x == y || x == 0 || y == 0;
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