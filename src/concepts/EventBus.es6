import Registry from './Registry.js';
import { assert, isFunction } from 'utils/fn.js';

/**
 * EventBus(Pub/Sub, EventChannel, event queue) - Event types, N-to-N observers decoupled from subjects.
 */

export default class EventBus {
    
    constructor(){
        
        this.registry = new Registry(id => new Map());
    }

    subscribe(eventType, handler) {
        
        assert(isFunction(handler.handleEvent), 'handler.handleEvent is not a function');

        this.registry.get(eventType).set(handler.id || "*",  handler );
    }

    unsubscribe(handlerId) {

        this.registry.forEach(o => o.delete(handlerId));
    }

    emitEvent(event) {
        
        this.registry.get(event.type).forEach( (id, handler) => handler.handleEvent(event) );
    }
}