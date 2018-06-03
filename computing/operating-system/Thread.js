export class Thread {

  constructor(process, IP) {
    this.IP = 0;
    this.process = process;
  }

  nextTick() {

    this.program.IP = this.IP;
    this.IP = this.program.IP;
  }

  run(CS, IP = 0) {

    this.CS = CS;
    this.IP = IP;

    this.isActive = true;
  }

  resume() {

    this.isActive = true;
  }

  pause() {

    this.isActive = false;
  }

  stop() {

    this.pause();
        this.SS.done();

    this.process.deleteThread(this);
  }
}
