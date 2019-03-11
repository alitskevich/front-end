// physical device
export const COMPUTER = (MEM_SIZE=2<<20) => {
  
  // 32-bit memory 
  const bytes = new ArrayBuffer(MEM_SIZE<<2)
  const MEMORY = new DataView(bytes)

  // read word from given address
  const READ = (addr) => MEMORY.getInt32(addr<<2)
  // write word value into given address
  const WRITE = (addr, value) => MEMORY.setInt32(addr<<2, value)
  
  // registries (we use memory address space out of size)
  const REG = 'AX,BX,CX,DX,IP,SP,DP,EP,CS,SS,DS,ES'.split(',').reduce((r,e,i)=>((r[e]=-i), r),{})
  const JMP = $ => W(REG.IP, $)
  
  // flags
  function FLAGS(X,C,F,H) {
    FLAGS.IS_ZERO = X === 0 ? 1 : 0;
    FLAGS.IS_CARRY = C === 1 ? 1 : 0;
    FLAGS.IS_FAULT = isNaN(F) ? 1 : 0;
    FLAGS.IS_HALT = H === 1 ? 1 : 0;
    return X;
  }

  const OPS = Object.entries({
    // mutation
    MOV: ($, V) => W($, V)
    // compare
    CMP: ($, V) => (IS_ZERO = R($) === V)
    // arithmetic
    INC: ($) => W($, FLAGS(R($) + 0x1) )
    DEC: ($) => W($, FLAGS(R($) - 0x1) )
    ADD: ($, V) => W($, FLAGS(R($) + V) )
    SUB: ($, V) => W($, FLAGS(R($) - V) )
    MUL: ($, V) => W($, FLAGS(R($) * V) )
    DIV: ($, V) => W($, FLAGS(R($) / V) )
    // logical
    NOT: ($) => W($, R($) === 0 ? 1 : 0 )
    AND: ($, V) => W($, FLAGS(R($) && V) )
    OR: ($, V) => W($, FLAGS(R($) || V) )
    // bitwise
    XOR: ($, V) => W($, FLAGS(R($) | V) )
    XAND: ($, V) => W($, FLAGS(R($) & V) )
    SHL: ($, V) => W($, FLAGS(R($) << V) )
    SHR: ($, V) => W($, FLAGS(R($) >> V) )
    // control flow
    HALT: () => FLAGS(0,0,0,1)
    JC: ($) => FLAGS.IS_CARRY === 1 && JMP($)
    JNC: ($) => FLAGS.IS_CARRY === 0 && JMP($)
    JZ: ($) => FLAGS.IS_ZERRO === 1 && JMP($)
    JNZ: ($) => FLAGS.IS_ZERRO === 0 && JMP($)
    JA: ($) => FLAGS.IS_CARRY + FLAGS.IS_ZERRO !== 0 && JMP($)
    JNA: ($) => FLAGS.IS_CARRY + FLAGS.IS_ZERRO === 0 && JMP($)
  });

  function LAUNCH (CODE, STACK_SIZE=2<<16) {
    let OP_CODE, OP_ADDR
    while (FLAGS.IS_HALT===0) {
      OP_ADDR = R(REG.IP)
      JMP(OP_ADDR+3)
      OP_CODE = R(OP_ADDR)
      OPS[OP_CODE][1]();
    }
  }
  // publish api
  return { LAUNCH, R, W, OPS, REG }
}