// physical random-access read-write 32-bit memory
export function PHY_MEMORY (MEM_SIZE) {
    const BYTES = new ArrayBuffer(MEM_SIZE<<2)
    const MEMORY = new DataView(BYTES)
    return {
        R: ($) => MEMORY.getInt32($<<2), /* read word from given address */
        W: ($, V) => MEMORY.setInt32($<<2, V) /* write word value into given address */
    }
}
  