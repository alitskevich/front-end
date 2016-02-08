export default class EventEmitter {

    constructor(){

        this.listeners = new Map();
    }

    addListener(key, handler){
        let handlers = this.listeners.get(key);

        if (!handlers){
            this.listeners.set(key, handlers = new Set())
        }

        handlers.add(handler);

        return handler;
    }

    removeListener(handler){

        for (let handlers of this.listeners.values()) if (handlers.has(handler)){

            handlers.remove(handler);
        }
    }

    trigger(event){
        let handlers = this.listeners.get(event.key);

        if (handlers){
            [...handlers.values()].forEach(handler=>handler(event));
        }
    }
}