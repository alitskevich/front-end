var QUEUE = [];

function now() {
  return Date.now().valueOf();
}

class Message {

  constructor(handler, lag = 0, isRepeatable = false) {

    this.lag = lag;
    this.handler = handler;
    this.timestamp = now() + lag;
    this.isRepeatable = isRepeatable;

  }

  isReady() {
    return this.timestamp < now();
  }

  run() {

    this.handler();

    if (this.isRepeatable) {
      this.timestamp = now() + this.lag;
      QUEUE.push(this);
    }
  }

  stop() {
    this.isRepeatable = false;
  }
}

function addMessageToQueue(m, onTop = false) {

  QUEUE[onTop ? 'unshift' : 'push'](m);

  return m;
}

function findFirstActualMessage(_now) {

  for (let h of QUEUE) {
    if (h.timestamp < _now) {
      QUEUE = QUEUE.filter(e=>(e !== h));
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

  post(handler) {

    return addMessageToQueue(new Message(handler, 0, false));
  }

  start() {

    while (!this.stopped) {

      const message = findFirstActualMessage(now());

      if (message) {

        message.run();

      } else {

        this.$$sleep$$(10);
      }

    }
  }

  stop() {

    this.stopped = true;
  }

  start2() {

    this.interval = setInterval(() => {

      const message = findFirstActualMessage(now());

      if (message) {

        message.run();

      }
    }, 100);
  }

  stop2() {

    // stopInterval(this.interval);
  }
}
