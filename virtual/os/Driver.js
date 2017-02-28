export class Driver {

  constructor(name, data) {

    this.name = name;

    this.isOpen = false;
  }

  open(drive) {

    this.isOpen = drive.openFile();
  }

  read(path) {

    return this.isOpen ? this.data : null;
  }

  write(data) {

    if (this.isOpen) {

        this.data = data;
    }
  }

  close() {

    this.isOpen = false;
  }

  append(data) {

    if (this.isOpen) {

      this.data = this.data + data;
    }

  }
}
