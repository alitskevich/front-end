const QUEUE = [];

var NOW = Date.now().valueOf();

class Message {

    constructor(handler, lag=0, isRepeatable=false){

        this.handler = handler;
        this.timestamp = NOW+lag;
        this.isRepeatable = isRepeatable;

    }

    isReady() {
        return this.timestamp < NOW
    }

    run() {

        this.handler();

        if (this.isRepeatable){
            this.timestamp = NOW+lag;
            QUEUE.push(this)
        }
    }

    stop(){
        this.isRepeatable = false;
    }
}

function addMessageToQueue(m, onTop=false) {
    if (onTop){

        QUEUE.unshift(m);
    } else{

        QUEUE.push(m);
    }

    return m;
}

function findFirstHotMessage(){

    for(h of QUEUE) {
        if (h.timestamp < NOW){
            return h;
        }
    }

    return null;
}

export default class RunLoop {

    setInterval(handler, period) {

        return addMessageToQueue(new Message(handler, period, true));
    }

    setTimeout(handler, lag) {

        return addMessageToQueue(new Message(handler, lag, false));
    }

    setImmediate(handler) {

        return addMessageToQueue(new Message(handler, 0, false), true);
    }

    nextTick(handler) {

        return addMessageToQueue(new Message(handler, 0, false));
    }

    start() {

        while(!this.stopped){

            NOW = Date.now().valueOf();

            handler = this.getAvailableHandler();

            if (handler){

                handler.run();

            } else {

                this.sleep(10);
            }

        }
    }

    stop(){

        this.stopped  = true;
    }
}
