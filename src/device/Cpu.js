import memory from './Memory.js'
// https://schweigi.github.io/assembler-simulator/instruction-set.html

class Registry {
    
    set IP (addr) {
        this._IP = memory.checkAddr(addr);
    }
    
    set SP (addr) {
        this._SP = memory.checkAddr(addr);
    }

}

let    AX = 0;
let    BX = 0;
let    CX = 0;
let    DX = 0;
let    EX = 0;
    
let    IP = 0;
let    CP = 0;


class Processor {
    
    constructor(memory, opSet) {
        
        this.opSet = opSet;
        this.memory = memory;
    }
    
    run () {
        
        while (true) {
            
            const opcode = this.readNext();
            
            const op = this.opSet[opcode];
            
            this.populateArgs(op);
            
            this.evaluate(op);
            
        }
    }
    
    populateArgs(op) {
        
    }
            
    evaluate(op) {
        
    }
    
    readNext() {
        
        return memory.read(IP++)
    }
    
    reset() {
        
        var self = this;
        self.maxSP = 231;
        self.minSP = 0;

        self.gpr = [0, 0, 0, 0];
        self.sp = self.maxSP;
        self.ip = 0;
        self.zero = false;
        self.carry = false;
        self.fault = false;
        
        this.memory.reset();
        
    }
}

export default new Processor();