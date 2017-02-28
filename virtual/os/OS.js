import FileSystem from './filesystem/FileSystem.js';
import Program from './Program.js';

export default class OS {

    constructor(cpu, memory) {

        this.fs = new FileSystem();
        this.cpu = cpu;
        this.memory = memory;
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

    executeFromPath(path, params) {

      const code = this.fs.readFile(path);

      const program = new Program(code, params, this);

      return this.execute(program);
    }

    Socket() {

    }

}
