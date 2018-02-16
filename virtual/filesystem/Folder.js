import File from './File.js';

export default class Folder extends File {

    constructor(name, data = []) {
      super();
      this.name = name;
      this.data = data;
    }

    files() {

      return this.data;
    }
}
