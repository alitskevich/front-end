// @see https://schweigi.github.io/assembler-simulator/instruction-set.html
export default ({ REG, cpu, nextIp, read }) => {

  const OP = nextIp;
  const R = () => read(nextIp());
  const ADDR = () => read(nextIp());
  const REGADDR = () => read(read(read(nextIp())));

  const FLAGS = (x) => {

    cpu.zero = x === 0 ? 0 : 1;
    cpu.carry = x > 255 ? 1 : 0;
    cpu.fault = isNaN(x);

    return x;
  };

  const LOG = (...args) => {

    console.log(`OpSet`, ...args);

    return args[args.length - 1];
  };

  const OP_NOT_FOUND = (code) => () => LOG(`Op code not found`, code, {});
  const FUNCTIONS = {

    MOV: (addr, value) => ({ [addr]: value }),

    CMP: (v1, v2) => FLAGS(v1 - v2),

    NOT: (addr) => ({ [addr]: read(addr) ? 0 : 1 }),
    INC: (addr) => ({ [addr]: read(addr) + 0x1 }),
    DEC: (addr) => ({ [addr]: read(addr) - 0x1 }),

    ADD: (addr, value) => ({ [addr]: FLAGS(read(addr) + value) }),
    SUB: (addr, value) => ({ [addr]: FLAGS(read(addr) - value) }),
    MUL: (addr, value) => ({ [addr]: FLAGS(read(addr) * value) }),
    DIV: (addr, value) => ({ [addr]: FLAGS(read(addr) / value) }),

    AND: (addr, value) => ({ [addr]: FLAGS(read(addr) && value) }),
    OR: (addr, value) => ({ [addr]: FLAGS(read(addr) || value) }),
    XOR: (addr, value) => ({ [addr]: FLAGS(read(addr) & value) }),
    SHL: (addr, value) => ({ [addr]: FLAGS(read(addr) << value) }),
    SHR: (addr, value) => ({ [addr]: FLAGS(read(addr) >> value) }),

    JMP: (addr) => ({ IP: addr }),
    JC: (addr) => ({ IP: cpu.carry ? addr : cpu.IP }),
    JNC: (addr) => ({ IP: !cpu.carry ? addr : cpu.IP }),
    JZ: (addr) => ({ IP: cpu.zerro ? addr : cpu.IP }),
    JNZ: (addr) => ({ IP: !cpu.zerro ? addr : cpu.IP }),
    JA: (addr) => ({ IP: !cpu.zero && !cpu.carry ? addr : cpu.IP }),
    JNA: (addr) => ({ IP: cpu.zero || cpu.carry ? addr : cpu.IP }),

    CALL: (addr, sp = cpu.SP) => ({ IP: addr, [sp]: cpu.IP + 1, SP: sp + 1 }),

    POP: (addr, sp = cpu.SP) => ({ [addr]: read(sp), SP: sp - 1 }),
    PUSH: (value, sp = cpu.SP) => ({ [sp]: value, SP: sp + 1 })

  };

  const OPERANDS = {

    OP: (fn) => fn(OP()),
    R: (fn) => fn(R()),
    ADDR: (fn) => fn(ADDR()),
    REGADDR: (fn) => fn(REGADDR()),

    ADDR2: (fn) => fn(ADDR(), ADDR()),
    ADDR_OP: (fn) => fn(ADDR(), OP()),
    ADDR_R: (fn) => fn(ADDR(), R()),
    REGADDR_OP: (fn) => fn(REGADDR(), OP()),
    REGADDR_R: (fn) => fn(REGADDR(), R()),

    OP2: (fn) => fn(OP(), OP()),
    OP_R: (fn) => fn(OP(), R()),
    OP_ADDR: (fn) => fn(OP(), ADDR()),
    OP_REGADDR: (fn) => fn(OP(), REGADDR()),

    R2: (fn) => fn(R(), R()),
    R_OP: (fn) => fn(R(), OP()),
    R_ADDR: (fn) => fn(R(), REGADDR()),
    R_REGADDR: (fn) => fn(R(), REGADDR())
  };

  const SET = {

    HALT: ()=>({}),
    RET: (sp = cpu.SP) => ({ IP: read(sp), SP: sp - 1 })
  };

  const DEFINE = (fnId, ...operands) => {
    const fn = FUNCTIONS[fnId] || (()=>({}));
    operands.forEach(opId => {
      const op = OPERANDS[opId];
      const opKey = (opId === 'OP' || opId === 'OP2') ? fnId : `${fnId}_${opId}`;
      SET[opKey] = ()=> op(fn);
    });
  };

  DEFINE('MOV', 'R2', 'REGADDR_R', 'ADDR_R', 'OP2', 'ADDR_OP', 'REGADDR_OP', 'R_ADDR', 'R_REGADDR', 'OP_R', 'OP_ADDR', 'OP_REGADDR');
  DEFINE('CMP', 'R2', 'REGADDR_R', 'ADDR_R', 'OP2', 'ADDR_OP', 'REGADDR_OP', 'R_ADDR', 'R_REGADDR', 'OP_R', 'OP_ADDR', 'OP_REGADDR');

  DEFINE('ADD', 'R2', 'REGADDR_R', 'ADDR_R', 'OP_R', 'ADDR2', 'OP_ADDR');
  DEFINE('SUB', 'R2', 'REGADDR_R', 'ADDR_R', 'OP_R');
  DEFINE('MUL', 'R2', 'REGADDR_R', 'ADDR_R', 'OP_R');
  DEFINE('DIV', 'R2', 'REGADDR_R', 'ADDR_R', 'OP_R');

  DEFINE('AND', 'R2', 'REGADDR_R', 'ADDR_R', 'OP_R');
  DEFINE('OR', 'R2', 'REGADDR_R', 'ADDR_R', 'OP_R');
  DEFINE('XOR', 'R2', 'REGADDR_R', 'ADDR_R', 'OP_R');
  DEFINE('SHL', 'R2', 'REGADDR_R', 'ADDR_R', 'OP_R');
  DEFINE('SHR', 'R2', 'REGADDR_R', 'ADDR_R', 'OP_R');

  DEFINE('JMP', 'REGADDR', 'ADDR');
  DEFINE('JC', 'REGADDR', 'ADDR');
  DEFINE('JNC', 'REGADDR', 'ADDR');
  DEFINE('JZ', 'REGADDR', 'ADDR');
  DEFINE('JNZ', 'REGADDR', 'ADDR');
  DEFINE('JA', 'REGADDR', 'ADDR');
  DEFINE('JNA', 'REGADDR', 'ADDR');

  DEFINE('CALL', 'REGADDR', 'ADDR');

  DEFINE('PUSH', 'R', 'REGADDR', 'ADDR', 'OP');

  DEFINE('NOT', 'R', 'REGADDR', 'ADDR', 'OP');
  DEFINE('INC', 'R', 'REGADDR', 'ADDR', 'OP');
  DEFINE('DEC', 'R', 'REGADDR', 'ADDR', 'OP');

  const CODES = Object.keys(SET);

  return (code) => SET[CODES[code] || code] || OP_NOT_FOUND(code);

};
