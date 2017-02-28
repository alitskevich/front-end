
export default class MemoryStack {

  constructor(DS, size = 64 * 1024) {

    let offset = DS.malloc(size);

    let stackIndex = offset;

    Object.assign(this, {

      push(value) {

        DS.write(offset + stackIndex++, value);
      },

      pop() {

        return DS.read(offset + stackIndex--);
      },

      get top() {

        return DS.read(offset + stackIndex - 1);
      },

      done() {

        DS.free(offset);
      }
    });
  }
}
