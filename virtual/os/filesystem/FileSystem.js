import Folder from './Folder.js';
import File from './File.js';

const ROOT = new Folder('/', [

    new File('_boot.asm', ''),
    new File('Hello.asm', ''),

    new Folder('Games', [
        new File('qs.exe', 'dhfvuhfvsdhvsudvbsuvbuvb'),
        new File('qs.dat', 'dhfvuhfvsdhvsudvbsuvbuvb'),
        new Folder('bin', [
            new File('qs2.exe', 'dhfvuhfvsdhvsudvbsuvbuvb'),
            new File('qs4.dat', 'dhfvuhfvsdhvsudvbsuvbuvb')
        ])
    ])
]);

export default class FileSystem {

    constructor(drive) {

        this.drive = drive;
    }

    readBootSector() {

    }

    find(path = '/') {
      const file = 123;
      return file;
    }

    ls(path = '/') {

        ROOT.ls();
    }

    mkdir() {

    }

    readFile(path) {

        const file = this.find(path);

        const descr = file.open(this.drive);

        const data = file.read();

        file.close();

        return data;
    }

    writeFile(path) {

    }
}
