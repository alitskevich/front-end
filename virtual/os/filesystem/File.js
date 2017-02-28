export default class File {

  constructor(name, data, address, size) {

    this.name = name;

    this.address = address;

    this.size = size;

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
