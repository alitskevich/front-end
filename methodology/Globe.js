import { capitalize } from '../src/utils/str.js';

class Globe {

  constructor() {

    this.queue = [];
    this.listeners = new Set();
  }

  fireEvent(event) {

    this.queue.push(event);
  }

  listenEvents(someone) {

    this.listeners.add(someone);
  }

  unlistenEvents(someone) {

    this.listeners.delete(someone);
  }

  timeline() {

    setInterval(() => {

      const event = this.queue.shift();

      if (event) {

        const key = `on${capitalize(event.type)}Event`;

        this.listeners.values().forEach(l => l[key] ? l[key](event) : null );
      }

    }, 10);

  }
}

const globe = new Globe();

globe.timeline();

Object.assign(Object, {
  emit: (event) => globe.fireEvent(event),
  join: (target) => {

    globe.fireEvent({ type:'join', target });

    globe.listenEvents(target);
  },
  leave: (target) => {

    globe.unlistenEvents(self);

    globe.fireEvent({ type:'leave', target });
  }
});

export default globe;
