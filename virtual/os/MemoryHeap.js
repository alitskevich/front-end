export default class MemoryHeap {

  constructor(DS) {

    let dataIndex = 0;

    Object.assign(this, {

      malloc(size = 1) {

        let ref = 0;

        while (ref < dataIndex) {

          const ssize = DS.read(ref);

          if ((DS.read(ref + 1 ) === 0x0) && (ssize === size)) {

            return ref;
          }
          ref += ssize;
        }

        ref = dataIndex;

        DS.writeBytes(ref, size);

        dataIndex += size + 2;

        return ref;
      },

      read(ref, offset = 0) {

        return DS.read(ref + offset + 2);
      },

      write(ref, offset = 0, value = 0) {

        DS.write(ref + offset + 2, value);
      },

      copyData(toAddr, fromAddr, size) {

        if (fromAddr !== toAddr && size !== 0) {

          DS.writeBytes(toAddr, DS.readBytes(fromAddr, size + 2));
        }
      },

      equals(ref1, ref2, size) {

        if (ref1 !== ref2 && size !== 0) {

          for (let i = size; i; i--) {

            if (DS.read(ref1 + i + 1) !== DS.read(ref2 + i + 1)) {

              return false;
            }
          }
        }
        return true;
      },

      retain(ref) {

        const c = DS.read(ref + 1 );

        DS.write(ref + 1, c + 1);

        return ref;
      },

      release(ref) {

        const c = DS.read(ref + 1 );

        if (c > 0) {

          DS.write(ref + 1, c - 1);
        }
      },

      free(ref) {

        DS.write(ref + 1, 0);
      },

      defrag() {

        dataIndex = 0;

        for (let ref = dataIndex; ref; ref -= 2) {

          const c = DS.read(ref + 1 );

          if (c > 0) {

            let size = DS.read(ref);

            DS.writeBytes(dataIndex, DS.readBytes(ref, size + 2));

            dataIndex += size;
          }
        }
      },

      done() {

        DS.release();
      }
    });
  }
}
