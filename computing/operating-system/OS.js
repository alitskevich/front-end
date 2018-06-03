import FileSystem from '../filesystem/FileSystem.js';
import Program from './Program.js';

export default class OS {

    constructor(device) {

      this.device = device;

      this.fs = new FileSystem();
      this.threads = new Set();
    }

    boot(program = 'ShellProgram') {

      this.execute(program);

      while (this.threads.size) {
        this.threads.forEach(thread => {
          if (thread.isActive) {
            thread.nextTick();
          }
        });
      }
    }

    reboot() {

    }

    ls(path = '') {

    }

    mkdir() {

    }

    openFile(path) {

    }

    close(ref) {

    }

    read(ref) {

    }

    write(ref, data) {

    }

    executeFile(path, params) {

      const code = this.fs.readFile(path);

      const program = new Program(code, params, this);

      return this.execute(program);
    }
    Run(program, ...args){
      W(SP, STACK_SIZE)
      W(IP, STACK_SIZE)
      for (let i = 0; i < CODE.length; i++) {
        W(STACK_SIZE+i, CODE[i]);
      }
      program.compile(API).run(...args)
    }
    Socket() {

    }

}
