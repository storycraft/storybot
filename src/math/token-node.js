export default class TokenNode {
    constructor(rootNode = null, token = null, leftNode = null, rightNode = null){
        this.rootNode = rootNode;

        this.token = token;

        this.leftNode = leftNode;
        this.rightNode = rightNode;
    }

    get RootNode(){
        return this.rootNode;
    }

    get Token(){
        return this.token;
    }
    
    get LeftNode(){
        return this.leftNode;
    }

    get RightNode(){
        return this.rightNode;
    }

    set RootNode(rootNode){
        this.rootNode = rootNode;

        this.LeftNode.RootNode = this.RightNode.RootNode = rootNode;
    }

    set Token(token){
        this.token = token;
    }

    set LeftNode(leftNode){
        this.leftNode = leftNode;
    }

    set RightNode(rightNode){
        this.rightNode = rightNode;
    }
}