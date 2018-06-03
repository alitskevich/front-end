import MemorySegment from './Memory.Segment.js';

export default class Memory {

    constructor(SIZE = 100) {

      const data = new Array(SIZE);
      for (let i = 0; i < SIZE; i++) {
        data[i] = new MemorySegment();
      }

      const checkSegment = (segment) => {

          if (segment < 0 || segment >= SIZE) {
            throw new Error(`Memory access violation at segment ${segment}`);
          }

          return segment;
      };

      this.retainSegment = () => data.find(seg=>!seg.retained).retain();

      this.releaseSegment = (seg) => seg.release();

      this.read = (addr, segment = 0) => data[checkSegment(segment)].read(addr);

      this.write = (addr, value, segment = 0) => {

          data[checkSegment(segment)].write(addr, value);
      };

      this.readBytes = (addr, size, segment = 0) => data[checkSegment(segment)].readBytes(addr, size);

      this.writeBytes = (addr, value, segment = 0) => {

          data[checkSegment(segment)].writeBytes(addr, value);
      };
    }
}
