const SIZE = 1024 * 1024;

export default class MemorySegment {

    constructor() {

      const data = ArrayBuffer(SIZE);

      const checkAddr = (address) => {

          if (address < 0 || address >= SIZE) {
            throw new Error(`Memory access violation at ${address}`);
          }

          return address;
      };


    }

    retain() {

      this.retained = true;

      return this;
    }

    release() {

      this.retained = false;

      return this;
    }
}
