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

      this.read = (address) => data[checkAddr(address)];

      this.readBytes = (address, size = 1) => data.slice(checkAddr(address), address + size + 1);

      this.write = (address, value) => {

          data[checkAddr(address)] = value;
      };

      this.writeBytes = (address, values) => {

        const size = values.length;

        if (checkAddr(address) && checkAddr(address + size - 1) && (size > 0)) {

          for (let i = 0; i < size; i++) {

            data[address + i] = values[i];
          }
        }
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
