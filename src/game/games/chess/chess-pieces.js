import BoardMathHelper from './board-math-helper';

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

export class PawnPiece extends ChessPiece {
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

    canMoveTo(location){
        if (!super.canMoveTo(location))
            return false;
        
        let loc = BoardMathHelper.fromCombinedLocation(super.Location);
        let to = BoardMathHelper.fromCombinedLocation(location);

        let offX = to[0] - location[0];
        let offY = to[1] - location[1];

        let direction = this.Board.WhitePieces.includes(this) ? -1 : 1;

        if (offX == 0){
            if (this.default && offY == direction * 2)
                return true;
        
            if (offY == direction)
                return true;
        }

        if (offY == direction && Math.abs(offX) == 1 && super.Board.getPieceAt(location))
            return true;

        return false;
    }
}

export class RookPiece extends ChessPiece {
    constructor(board, location){
        super(board, location);

        super.drawable = new RookDrawable(this);
    }

    get Score(){
        return 5;
    }

    canMoveTo(location){
        if (!super.canMoveTo(location))
            return false;

        let loc = BoardMathHelper.fromCombinedLocation(this.Location);
        let to = BoardMathHelper.fromCombinedLocation(location);

        let xOff = to[0] - loc[0];
        let yOff = to[1] - loc[1];

        if (xOff && yOff)
            return false;

        //위 아래로만 움직일 경우

        if (!xOff){
            var dirY = yOff / Math.abs(yOff);
            
            for (let i = 0; i < dirY; i++){
                if (super.Board.getPieceAt(BoardMathHelper.getCombinedLocation(loc[1], loc[1] + dirY * i)))
                return false;
            }
        }//왼쪽 오른쪽으로만 움직일 경우
        else if(!yOff){
            var dirX = xOff / Math.abs(xOff);

            for (let i = 0; i < dirX; i++){
                if (super.Board.getPieceAt(BoardMathHelper.getCombinedLocation(loc[0] + dirX * i, loc[1])))
                    return false;
            }
        }

        return true;
    }
}

export class BishopPiece extends ChessPiece {
    constructor(board, location){
        super(board, location);

        super.drawable = new BishopDrawable(this);
    }

    get Score(){
        return 3;
    }

    canMoveTo(location){
        if (!super.canMoveTo(location))
            return false;

        let loc = BoardMathHelper.fromCombinedLocation(super.Location);
        let to = BoardMathHelper.fromCombinedLocation(location);

        let offX = to[0] - loc[0];
        let offY = to[1] - loc[1];

        if (Math.abs(offX) != Math.abs(offY))
            return false;

        var distance = Math.abs(offX);

        var direX = offX / distance;
        var direY = offY / distance;

        for (let i = 1; i < distance; i++){
            if (super.Board.getPieceAt(BoardMathHelper.getCombinedLocation(loc[0] + direX * i,loc[1] + direY * i)))
                return false;
        }
    }
}

export class KnightPiece extends ChessPiece {
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

    canMoveTo(location){
        if (!super.canMoveTo(location))
            return false;

        let loc = BoardMathHelper.fromCombinedLocation(super.Location);
        let to = BoardMathHelper.fromCombinedLocation(location);

        var x = Math.abs(to[0] - loc[0]);
        var y = Math.abs(to[1] - loc[1]);

        return x && y && x + y == 3;
    }
}

export class KingPiece extends ChessPiece {
    constructor(board, location){
        super(board, location);

        super.drawable = new KingDrawable(this);
    }

    canMoveTo(location){
        if (!super.canMoveTo(location) || board.getPieceAt(location))
            return false;

        let loc = BoardMathHelper.fromCombinedLocation(super.Location);
        let to = BoardMathHelper.fromCombinedLocation(location);

        var x = Math.abs(to[0] - loc[0]);
        var y = Math.abs(to[1] - loc[1]);

        return (x == 0 && y == 1) || (x == 1 && y == 0) || (x == 1 && y == 1);
    }
}

export class QueenPiece extends ChessPiece {
    constructor(board, location){
        super(board, location);

        super.drawable = new QueenDrawable(this);
    }

    get Score(){
        return 9;
    }

    canMoveTo(location){
        if (!super.canMoveTo(location))
            return false;

        return new RookPiece(super.Board, this.Location).canMoveTo(location) || new BishopPiece(super.Board, this.Location).canMoveTo(location);
    }
}

class PawnDrawable extends PieceDrawable {
    constructor(piece){
        super(piece);
    }

    draw(ctx, pieceImage, color){
        var loc = BoardMathHelper.fromCombinedLocation(this.Piece.Location);

        ctx.drawImage(pieceImage, (PIECE_SOURCE_SIZE[0] + PIECE_SOURCE_OFFSET) * PIECE_PAWN, color * PIECE_SOURCE_SIZE[1], PIECE_SOURCE_SIZE[0], PIECE_SOURCE_SIZE[1], 
        loc[0] * PIECE_SIZE, /*위치가 반대이므로 뒤집어줌*/(7 - loc[1]) * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);
    }
}

class RookDrawable extends PieceDrawable {
    constructor(piece){
        super(piece);
    }

    draw(ctx, pieceImage, color){
        var loc = BoardMathHelper.fromCombinedLocation(this.Piece.Location);
        ctx.drawImage(pieceImage, (PIECE_SOURCE_SIZE[0] + PIECE_SOURCE_OFFSET) * PIECE_ROOK, color * PIECE_SOURCE_SIZE[1], PIECE_SOURCE_SIZE[0], PIECE_SOURCE_SIZE[1], 
        loc[0] * PIECE_SIZE, (7 - loc[1]) * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);
    }
}

class BishopDrawable extends PieceDrawable {
    constructor(piece){
        super(piece);
    }

    draw(ctx, pieceImage, color){
        var loc = BoardMathHelper.fromCombinedLocation(this.Piece.Location);
        ctx.drawImage(pieceImage, (PIECE_SOURCE_SIZE[0] + PIECE_SOURCE_OFFSET) * PIECE_BISHOP, color * PIECE_SOURCE_SIZE[1], PIECE_SOURCE_SIZE[0], PIECE_SOURCE_SIZE[1], 
        loc[0] * PIECE_SIZE, (7 - loc[1]) * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);
    }
}

class KnightDrawable extends PieceDrawable {
    constructor(piece){
        super(piece);
    }

    draw(ctx, pieceImage, color){
        var loc = BoardMathHelper.fromCombinedLocation(this.Piece.Location);
        ctx.drawImage(pieceImage, (PIECE_SOURCE_SIZE[0] + PIECE_SOURCE_OFFSET) * PIECE_KNIGHT, color * PIECE_SOURCE_SIZE[1], PIECE_SOURCE_SIZE[0], PIECE_SOURCE_SIZE[1], 
        loc[0] * PIECE_SIZE, (7 - loc[1]) * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);
    }
}

class KingDrawable extends PieceDrawable {
    constructor(piece){
        super(piece);
    }

    draw(ctx, pieceImage, color){
        var loc = BoardMathHelper.fromCombinedLocation(this.Piece.Location);
        ctx.drawImage(pieceImage, (PIECE_SOURCE_SIZE[0] + PIECE_SOURCE_OFFSET) * PIECE_KING, color * PIECE_SOURCE_SIZE[1], PIECE_SOURCE_SIZE[0], PIECE_SOURCE_SIZE[1], 
        loc[0] * PIECE_SIZE, (7 - loc[1]) * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);
    }
}

class QueenDrawable extends PieceDrawable {
    constructor(piece){
        super(piece);
    }

    draw(ctx, pieceImage, color){
        var loc = BoardMathHelper.fromCombinedLocation(this.Piece.Location);
        ctx.drawImage(pieceImage, (PIECE_SOURCE_SIZE[0] + PIECE_SOURCE_OFFSET) * PIECE_QUEEN, color * PIECE_SOURCE_SIZE[1], PIECE_SOURCE_SIZE[0], PIECE_SOURCE_SIZE[1], 
        loc[0] * PIECE_SIZE, (7 - loc[1]) * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);
    }
}