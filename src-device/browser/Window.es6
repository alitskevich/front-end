class Window extends EventEmitter {

    constructor(){

        this.document = new Document();
    }

    Out(content) {
        
        document.getElementById('out').innerHTML = content
    }
}