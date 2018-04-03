import Memoize from './Memoize.js';
import Observable from './Observable.js';
import { assert, isFunction } from '../utils/fn.js';

const createRegistry = ()=> Memoize.create(id => new Observable());

/**
 * EventBus(Pub/Sub, EventChannel, event queue)
 * Event types, N-to-N observers decoupled from subjects.
 */
export const apply = ($, registry = createRegistry()) => Object.assign($, {

  subscribe( eventType, handler0, handlerId = handler0.id ) {

    const handler = (typeof handler0 === 'function' ) ? { handleEvent: handler0 } : handler0;

    assert(isFunction(handler.handleEvent),
      'handler.handleEvent is not a function');

    const observer = event => handler.handleEvent(event);

    registry.get(eventType).addObserver(observer, handlerId);

    return handlerId;
  },

  unsubscribe(handlerId) {

    registry.forEach(o => o.removeObserver(handlerId));
  },

  emitEvent(event) {
    // RunLoop.post
    registry.get(event.type).notify( event );
  }

});

export default class EventBus {

  static applyTo = apply;

  constructor() {

    apply(this);
  }
}
