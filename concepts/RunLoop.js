export default class RunLoop {
  constructor(handler, lag = 0, isRepeatable = false) {
    var QUEUE = [];
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

    const now = () => Date.now().valueOf();

    const sleep = () => {
      // not implemented
    }
    function addMessage(fn, period=0, repeatable=false,  placeOnTop = false) {
      const m = new Message(fn, period, repeatable)
      QUEUE[placeOnTop ? 'unshift' : 'push'](m);
      return m;
    }
    function findFirstActualMessage(_now) {
      for (let h of QUEUE) {
        if (h.timestamp < _now) {
          QUEUE = QUEUE.filter(e=>(e !== h));
          return h;
        }
      }
      return sleep;
    }
    this.setInterval = (fn, period) => addMessage(fn, period, true)
    this.setTimeout = (fn, lag) => addMessage(fn, lag, false)
    this.setImmediate = (fn) => addMessage(fn, 0, false, true)
    this.post = (fn) => addMessage(fn)
    this.start = () =>{
      while(true) {
        findFirstActualMessage(now()).run();
      }
    }
}
}
