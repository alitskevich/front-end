import { PHY_CPU } from './cpu.js'
import { PHY_MEMORY } from './memory.js'

// physical device
export const PHY_DEVICE = function(MEM_SIZE=1<<20 /*2^20 addresses*/){ 
  const {R, W} = PHY_MEMORY(MEM_SIZE) 
  const CPU = PHY_CPU(R, W)
  function LAUNCH (bytes){
    bytes.forEach((b,i) => W(i,b))
    CPU.SET_SP(MEM_SIZE)
    while (CPU.IS_HALT===0x0) {
      CPU.TICK();
    }
  }
  return { LAUNCH, R, W, OPCODE: CPU.OPCODE }
}