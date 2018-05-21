export default class TokenNode {
    constructor(rootNode = null, leftNode = null, rightNode = null){
        this.rootNode = rootNode;

        this.parentNode = null;

        this.token = null;

        this.leftNode = leftNode;
        this.rightNode = rightNode;
    }

    get RootNode(){
        return this.rootNode;
    }

    get parentNode(){
        return this.parentNode;
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
    }

    set ParentNode(parentNode){
        this.parentNode = parentNode;
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