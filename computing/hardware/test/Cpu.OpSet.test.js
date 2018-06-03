const data = { bytes: [] };

const memory = {

  init: (bytes) => { data.bytes = [...bytes, 0]; },

  read: (i) => data.bytes[i],

  write: (addr, byte) => (data.bytes[addr] = byte)
};

const cpu = new Cpu(memory, CpuOpSet);

const SAMPLES = {

  CMP: ['JMP', 3, 42, 'CMP_OP_ADDR', 42, 3],
  MOV: ['MOV', 42, 0, 'CMP_OP_R', 0, 42],
  INC: ['MOV', 42, 0, 'INC', 0, 'CMP_OP_R', 0, 43],
  ADD: ['JMP', 4, 42, 24, 'ADD_OP_ADDR', 2, 3, 'CMP_ADDR_OP', 2, 66]
};

describe('Cpu.OpSet', function () {

  Object.keys(SAMPLES).forEach(opcode=>{

    it(opcode, () => {

      memory.init(SAMPLES[opcode]);
      cpu.reset();
      assert.equal(cpu.zero, 0);
    });
  });

});
