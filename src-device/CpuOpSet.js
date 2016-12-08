

const OPS = {
    add: (a, b = 1) => a + b,
    sub: (a, b = 1) => a - b,
    mul: (a, b) => a * b,
    div: (a, b) => a / b,
    
    cmp: (a, b) => a === b,
    not: (a) => !a,
    and: (a, b) => a && b,
    or: (a, b) => a || b,
    xor: (a, b) => a & b,
    
    shl: (a, b) => a + b,
    shr: (a, b) => a + b
}

const OP_SET = (M, R) => {
        NONE: ()=>({R:{IP: 0}}),
        MOV_REG_TO_REG:         ({IP})=>({R:{ [M[IP+1]]: R[M[IP+2]],     IP: IP+2}}),
        MOV_ADDRESS_TO_REG:     ({IP})=>({R:{ [M[IP+1]]: M[M[IP+2]],     IP: IP+2}}),
        MOV_REGADDRESS_TO_REG:  ({IP})=>({R:{ [M[IP+1]]: M[R[M[IP+2]]],  IP: IP+2}}),
        MOV_REG_TO_ADDRESS: 4,
        MOV_REG_TO_REGADDRESS: 5,
        MOV_NUMBER_TO_REG: 6,
        MOV_NUMBER_TO_ADDRESS: 7,
        MOV_NUMBER_TO_REGADDRESS: 8,
        ADD_REG_TO_REG:         ({IP})=>({R:{ [M[IP+1]]: add(R[M[IP+1]], R[M[IP+2]]),     IP: IP+2}}),
        ADD_REGADDRESS_TO_REG: 11,
        ADD_ADDRESS_TO_REG: 12,
        ADD_NUMBER_TO_REG: 13,
        SUB_REG_FROM_REG: 14,
        SUB_REGADDRESS_FROM_REG: 15,
        SUB_ADDRESS_FROM_REG: 16,
        SUB_NUMBER_FROM_REG: 17,
        INC_REG:                ({IP})=>({R:{ [M[IP+1]]: add(R[M[IP+1]]),     IP: IP+1}}),
        DEC_REG:                ({IP})=>({R:{ [M[IP+1]]: sub(R[M[IP+1]]),     IP: IP+1}}),
        CMP_REG_WITH_REG: 20,
        CMP_REGADDRESS_WITH_REG: 21,
        CMP_ADDRESS_WITH_REG: 22,
        CMP_NUMBER_WITH_REG: 23,
        JMP_REGADDRESS: 30,
        JMP_ADDRESS: 31,
        JC_REGADDRESS: 32,
        JC_ADDRESS: 33,
        JNC_REGADDRESS: 34,
        JNC_ADDRESS: 35,
        JZ_REGADDRESS: 36,
        JZ_ADDRESS: 37,
        JNZ_REGADDRESS: 38,
        JNZ_ADDRESS: 39,
        JA_REGADDRESS: 40,
        JA_ADDRESS: 41,
        JNA_REGADDRESS: 42,
        JNA_ADDRESS: 43,
        PUSH_REG: 50,
        PUSH_REGADDRESS: 51,
        PUSH_ADDRESS: 52,
        PUSH_NUMBER: 53,
        POP_REG: 54,
        CALL_REGADDRESS: 55,
        CALL_ADDRESS: 56,
        RET: 57,
        MUL_REG: 60,
        MUL_REGADDRESS: 61,
        MUL_ADDRESS: 62,
        MUL_NUMBER: 63,
        DIV_REG: 64,
        DIV_REGADDRESS: 65,
        DIV_ADDRESS: 66,
        DIV_NUMBER: 67,
        AND_REG_WITH_REG: 70,
        AND_REGADDRESS_WITH_REG: 71,
        AND_ADDRESS_WITH_REG: 72,
        AND_NUMBER_WITH_REG: 73,
        OR_REG_WITH_REG: 74,
        OR_REGADDRESS_WITH_REG: 75,
        OR_ADDRESS_WITH_REG: 76,
        OR_NUMBER_WITH_REG: 77,
        XOR_REG_WITH_REG: 78,
        XOR_REGADDRESS_WITH_REG: 79,
        XOR_ADDRESS_WITH_REG: 80,
        XOR_NUMBER_WITH_REG: 81,
        NOT_REG: 82,
        SHL_REG_WITH_REG: 90,
        SHL_REGADDRESS_WITH_REG: 91,
        SHL_ADDRESS_WITH_REG: 92,
        SHL_NUMBER_WITH_REG: 93,
        SHR_REG_WITH_REG: 94,
        SHR_REGADDRESS_WITH_REG: 95,
        SHR_ADDRESS_WITH_REG: 96,
        SHR_NUMBER_WITH_REG: 97
    };

    return opcodes;
}]);
app.service('cpu', ['opcodes', 'memory', function(opcodes, memory) {
    var cpu = {
        step: function() {
            var self = this;

            if (self.fault === true) {
                throw "FAULT. Reset to continue.";
            }

            try {
                var checkGPR = function(reg) {
                    if (reg < 0 || reg >= self.gpr.length) {
                        throw "Invalid register: " + reg;
                    } else {
                        return reg;
                    }
                };

                var checkGPR_SP = function(reg) {
                    if (reg < 0 || reg >= 1 + self.gpr.length) {
                        throw "Invalid register: " + reg;
                    } else {
                        return reg;
                    }
                };

                var setGPR_SP = function(reg,value)
                {
                    if(reg >= 0 && reg < self.gpr.length) {
                        self.gpr[reg] = value;
                    } else if(reg == self.gpr.length) {
                        self.sp = value;

                        // Not likely to happen, since we always get here after checkOpertion().
                        if (self.sp < self.minSP) {
                            throw "Stack overflow";
                        } else if (self.sp > self.maxSP) {
                            throw "Stack underflow";
                        }
                    } else {
                        throw "Invalid register: " + reg;
                    }
                };

                var getGPR_SP = function(reg)
                {
                    if(reg >= 0 && reg < self.gpr.length) {
                        return self.gpr[reg];
                    } else if(reg == self.gpr.length) {
                        return self.sp;
                    } else {
                        throw "Invalid register: " + reg;
                    }
                };

                var indirectRegisterAddress = function(value) {
                    var reg = value % 8;
                    
                    var base;
                    if (reg < self.gpr.length) {
                        base = self.gpr[reg];
                    } else {
                        base = self.sp;
                    }
                    
                    var offset = Math.floor(value / 8);
                    if ( offset > 15 ) {
                        offset = offset - 32;
                    }
                    
                    return base+offset;
                };

                var checkOperation = function(value) {
                    self.zero = false;
                    self.carry = false;

                    if (value >= 256) {
                        self.carry = true;
                        value = value % 256;
                    } else if (value === 0) {
                        self.zero = true;
                    } else if (value < 0) {
                        self.carry = true;
                        value = 256 - (-value) % 256;
                    }

                    return value;
                };

                var push = function(value) {
                    memory.store(self.sp--, value);
                    if (self.sp < self.minSP) {
                        throw "Stack overflow";
                    }
                };

                var pop = function() {
                    var value = memory.load(++self.sp);
                    if (self.sp > self.maxSP) {
                        throw "Stack underflow";
                    }

                    return value;
                };

                var division = function(divisor) {
                    if (divisor === 0) {
                        throw "Division by 0";
                    }

                    return Math.floor(self.gpr[0] / divisor);
                };

                if (self.ip < 0 || self.ip >= memory.data.length) {
                    throw "Instruction pointer is outside of memory";
                }
                
                var regTo, regFrom, memFrom, memTo, number;
                var instr = memory.load(self.ip);
                switch(instr) {
                    case opcodes.NONE:
                        return false; // Abort step
                    case opcodes.MOV_REG_TO_REG:
                        regTo = checkGPR_SP(memory.load(++self.ip));
                        regFrom = checkGPR_SP(memory.load(++self.ip));
                        setGPR_SP(regTo,getGPR_SP(regFrom));
                        self.ip++;
                        break;
                    case opcodes.MOV_ADDRESS_TO_REG:
                        regTo = checkGPR_SP(memory.load(++self.ip));
                        memFrom = memory.load(++self.ip);
                        setGPR_SP(regTo,memory.load(memFrom));
                        self.ip++;
                        break;
                    case opcodes.MOV_REGADDRESS_TO_REG:
                        regTo = checkGPR_SP(memory.load(++self.ip));
                        regFrom = memory.load(++self.ip);
                        setGPR_SP(regTo,memory.load(indirectRegisterAddress(regFrom)));
                        self.ip++;
                        break;
                    case opcodes.MOV_REG_TO_ADDRESS:
                        memTo = memory.load(++self.ip);
                        regFrom = checkGPR_SP(memory.load(++self.ip));
                        memory.store(memTo, getGPR_SP(regFrom));
                        self.ip++;
                        break;
                    case opcodes.MOV_REG_TO_REGADDRESS:
                        regTo = memory.load(++self.ip);
                        regFrom = checkGPR_SP(memory.load(++self.ip));
                        memory.store(indirectRegisterAddress(regTo), getGPR_SP(regFrom));
                        self.ip++;
                        break;
                    case opcodes.MOV_NUMBER_TO_REG:
                        regTo = checkGPR_SP(memory.load(++self.ip));
                        number = memory.load(++self.ip);
                        setGPR_SP(regTo,number);
                        self.ip++;
                        break;
                    case opcodes.MOV_NUMBER_TO_ADDRESS:
                        memTo = memory.load(++self.ip);
                        number = memory.load(++self.ip);
                        memory.store(memTo, number);
                        self.ip++;
                        break;
                    case opcodes.MOV_NUMBER_TO_REGADDRESS:
                        regTo = memory.load(++self.ip);
                        number = memory.load(++self.ip);
                        memory.store(indirectRegisterAddress(regTo), number);
                        self.ip++;
                        break;
                    case opcodes.ADD_REG_TO_REG:
                        regTo = checkGPR_SP(memory.load(++self.ip));
                        regFrom = checkGPR_SP(memory.load(++self.ip));
                        setGPR_SP(regTo,checkOperation(getGPR_SP(regTo) + getGPR_SP(regFrom)));
                        self.ip++;
                        break;
                    case opcodes.ADD_REGADDRESS_TO_REG:
                        regTo = checkGPR_SP(memory.load(++self.ip));
                        regFrom = memory.load(++self.ip);
                        setGPR_SP(regTo,checkOperation(getGPR_SP(regTo) + memory.load(indirectRegisterAddress(regFrom))));
                        self.ip++;
                        break;
                    case opcodes.ADD_ADDRESS_TO_REG:
                        regTo = checkGPR_SP(memory.load(++self.ip));
                        memFrom = memory.load(++self.ip);
                        setGPR_SP(regTo,checkOperation(getGPR_SP(regTo) + memory.load(memFrom)));
                        self.ip++;
                        break;
                    case opcodes.ADD_NUMBER_TO_REG:
                        regTo = checkGPR_SP(memory.load(++self.ip));
                        number = memory.load(++self.ip);
                        setGPR_SP(regTo,checkOperation(getGPR_SP(regTo) + number));
                        self.ip++;
                        break;
                    case opcodes.SUB_REG_FROM_REG:
                        regTo = checkGPR_SP(memory.load(++self.ip));
                        regFrom = checkGPR_SP(memory.load(++self.ip));
                        setGPR_SP(regTo,checkOperation(getGPR_SP(regTo) - self.gpr[regFrom]));
                        self.ip++;
                        break;
                    case opcodes.SUB_REGADDRESS_FROM_REG:
                        regTo = checkGPR_SP(memory.load(++self.ip));
                        regFrom = memory.load(++self.ip);
                        setGPR_SP(regTo,checkOperation(getGPR_SP(regTo) - memory.load(indirectRegisterAddress(regFrom))));
                        self.ip++;
                        break;
                    case opcodes.SUB_ADDRESS_FROM_REG:
                        regTo = checkGPR_SP(memory.load(++self.ip));
                        memFrom = memory.load(++self.ip);
                        setGPR_SP(regTo,checkOperation(getGPR_SP(regTo) - memory.load(memFrom)));
                        self.ip++;
                        break;
                    case opcodes.SUB_NUMBER_FROM_REG:
                        regTo = checkGPR_SP(memory.load(++self.ip));
                        number = memory.load(++self.ip);
                        setGPR_SP(regTo,checkOperation(getGPR_SP(regTo) - number));
                        self.ip++;
                        break;
                    case opcodes.INC_REG:
                        regTo = checkGPR_SP(memory.load(++self.ip));
                        setGPR_SP(regTo,checkOperation(getGPR_SP(regTo) + 1));
                        self.ip++;
                        break;
                    case opcodes.DEC_REG:
                        regTo = checkGPR_SP(memory.load(++self.ip));
                        setGPR_SP(regTo,checkOperation(getGPR_SP(regTo) - 1));
                        self.ip++;
                        break;
                    case opcodes.CMP_REG_WITH_REG:
                        regTo = checkGPR_SP(memory.load(++self.ip));
                        regFrom = checkGPR_SP(memory.load(++self.ip));
                        checkOperation(getGPR_SP(regTo) - getGPR_SP(regFrom));
                        self.ip++;
                        break;
                    case opcodes.CMP_REGADDRESS_WITH_REG:
                        regTo = checkGPR_SP(memory.load(++self.ip));
                        regFrom = memory.load(++self.ip);
                        checkOperation(getGPR_SP(regTo) - memory.load(indirectRegisterAddress(regFrom)));
                        self.ip++;
                        break;
                    case opcodes.CMP_ADDRESS_WITH_REG:
                        regTo = checkGPR_SP(memory.load(++self.ip));
                        memFrom = memory.load(++self.ip);
                        checkOperation(getGPR_SP(regTo) - memory.load(memFrom));
                        self.ip++;
                        break;
                    case opcodes.CMP_NUMBER_WITH_REG:
                        regTo = checkGPR_SP(memory.load(++self.ip));
                        number = memory.load(++self.ip);
                        checkOperation(getGPR_SP(regTo) - number);
                        self.ip++;
                        break;
                    case opcodes.JMP_REGADDRESS:
                        regTo = checkGPR(memory.load(++self.ip));
                        jump(self.gpr[regTo]);
                        break;
                    case opcodes.JMP_ADDRESS:
                        number = memory.load(++self.ip);
                        jump(number);
                        break;
                    case opcodes.JC_REGADDRESS:
                        regTo = checkGPR(memory.load(++self.ip));
                        if (self.carry) {
                            jump(self.gpr[regTo]);
                        } else {
                            self.ip++;
                        }
                        break;
                    case opcodes.JC_ADDRESS:
                        number = memory.load(++self.ip);
                        if (self.carry) {
                            jump(number);
                        } else {
                            self.ip++;
                        }
                        break;
                    case opcodes.JNC_REGADDRESS:
                        regTo = checkGPR(memory.load(++self.ip));
                        if (!self.carry) {
                            jump(self.gpr[regTo]);
                        } else {
                            self.ip++;
                        }
                        break;
                    case opcodes.JNC_ADDRESS:
                        number = memory.load(++self.ip);
                        if (!self.carry) {
                            jump(number);
                        } else {
                            self.ip++;
                        }
                        break;
                    case opcodes.JZ_REGADDRESS:
                        regTo = checkGPR(memory.load(++self.ip));
                        if (self.zero) {
                            jump(self.gpr[regTo]);
                        } else {
                            self.ip++;
                        }
                        break;
                    case opcodes.JZ_ADDRESS:
                        number = memory.load(++self.ip);
                        if (self.zero) {
                            jump(number);
                        } else {
                            self.ip++;
                        }
                        break;
                    case opcodes.JNZ_REGADDRESS:
                        regTo = checkGPR(memory.load(++self.ip));
                        if (!self.zero) {
                            jump(self.gpr[regTo]);
                        } else {
                            self.ip++;
                        }
                        break;
                    case opcodes.JNZ_ADDRESS:
                        number = memory.load(++self.ip);
                        if (!self.zero) {
                            jump(number);
                        } else {
                            self.ip++;
                        }
                        break;
                    case opcodes.JA_REGADDRESS:
                        regTo = checkGPR(memory.load(++self.ip));
                        if (!self.zero && !self.carry) {
                            jump(self.gpr[regTo]);
                        } else {
                            self.ip++;
                        }
                        break;
                    case opcodes.JA_ADDRESS:
                        number = memory.load(++self.ip);
                        if (!self.zero && !self.carry) {
                            jump(number);
                        } else {
                            self.ip++;
                        }
                        break;
                    case opcodes.JNA_REGADDRESS: // JNA REG
                        regTo = checkGPR(memory.load(++self.ip));
                        if (self.zero || self.carry) {
                            jump(self.gpr[regTo]);
                        } else {
                            self.ip++;
                        }
                        break;
                    case opcodes.JNA_ADDRESS:
                        number = memory.load(++self.ip);
                        if (self.zero || self.carry) {
                            jump(number);
                        } else {
                            self.ip++;
                        }
                        break;
                    case opcodes.PUSH_REG:
                        regFrom = checkGPR(memory.load(++self.ip));
                        push(self.gpr[regFrom]);
                        self.ip++;
                        break;
                    case opcodes.PUSH_REGADDRESS:
                        regFrom = memory.load(++self.ip);
                        push(memory.load(indirectRegisterAddress(regFrom)));
                        self.ip++;
                        break;
                    case opcodes.PUSH_ADDRESS:
                        memFrom = memory.load(++self.ip);
                        push(memory.load(memFrom));
                        self.ip++;
                        break;
                    case opcodes.PUSH_NUMBER:
                        number = memory.load(++self.ip);
                        push(number);
                        self.ip++;
                        break;
                    case opcodes.POP_REG:
                        regTo = checkGPR(memory.load(++self.ip));
                        self.gpr[regTo] = pop();
                        self.ip++;
                        break;
                    case opcodes.CALL_REGADDRESS:
                        regTo = checkGPR(memory.load(++self.ip));
                        push(self.ip+1);
                        jump(self.gpr[regTo]);
                        break;
                    case opcodes.CALL_ADDRESS:
                        number = memory.load(++self.ip);
                        push(self.ip+1);
                        jump(number);
                        break;
                    case opcodes.RET:
                        jump(pop());
                        break;
                    case opcodes.MUL_REG: // A = A * REG
                        regFrom = checkGPR(memory.load(++self.ip));
                        self.gpr[0] = checkOperation(self.gpr[0] * self.gpr[regFrom]);
                        self.ip++;
                        break;
                    case opcodes.MUL_REGADDRESS: // A = A * [REG]
                        regFrom = memory.load(++self.ip);
                        self.gpr[0] = checkOperation(self.gpr[0] * memory.load(indirectRegisterAddress(regFrom)));
                        self.ip++;
                        break;
                    case opcodes.MUL_ADDRESS: // A = A * [NUMBER]
                        memFrom = memory.load(++self.ip);
                        self.gpr[0] = checkOperation(self.gpr[0] * memory.load(memFrom));
                        self.ip++;
                        break;
                    case opcodes.MUL_NUMBER: // A = A * NUMBER
                        number = memory.load(++self.ip);
                        self.gpr[0] = checkOperation(self.gpr[0] * number);
                        self.ip++;
                        break;
                    case opcodes.DIV_REG: // A = A / REG
                        regFrom = checkGPR(memory.load(++self.ip));
                        self.gpr[0] = checkOperation(division(self.gpr[regFrom]));
                        self.ip++;
                        break;
                    case opcodes.DIV_REGADDRESS: // A = A / [REG]
                        regFrom = memory.load(++self.ip);
                        self.gpr[0] = checkOperation(division(memory.load(indirectRegisterAddress(regFrom))));
                        self.ip++;
                        break;
                    case opcodes.DIV_ADDRESS: // A = A / [NUMBER]
                        memFrom = memory.load(++self.ip);
                        self.gpr[0] = checkOperation(division(memory.load(memFrom)));
                        self.ip++;
                        break;
                    case opcodes.DIV_NUMBER: // A = A / NUMBER
                        number = memory.load(++self.ip);
                        self.gpr[0] = checkOperation(division(number));
                        self.ip++;
                        break;
                    case opcodes.AND_REG_WITH_REG:
                        regTo = checkGPR(memory.load(++self.ip));
                        regFrom = checkGPR(memory.load(++self.ip));
                        self.gpr[regTo] = checkOperation(self.gpr[regTo] & self.gpr[regFrom]);
                        self.ip++;
                        break;
                    case opcodes.AND_REGADDRESS_WITH_REG:
                        regTo = checkGPR(memory.load(++self.ip));
                        regFrom = memory.load(++self.ip);
                        self.gpr[regTo] = checkOperation(self.gpr[regTo] & memory.load(indirectRegisterAddress(regFrom)));
                        self.ip++;
                        break;
                    case opcodes.AND_ADDRESS_WITH_REG:
                        regTo = checkGPR(memory.load(++self.ip));
                        memFrom = memory.load(++self.ip);
                        self.gpr[regTo] = checkOperation(self.gpr[regTo] & memory.load(memFrom));
                        self.ip++;
                        break;
                    case opcodes.AND_NUMBER_WITH_REG:
                        regTo = checkGPR(memory.load(++self.ip));
                        number = memory.load(++self.ip);
                        self.gpr[regTo] = checkOperation(self.gpr[regTo] & number);
                        self.ip++;
                        break;
                    case opcodes.OR_REG_WITH_REG:
                        regTo = checkGPR(memory.load(++self.ip));
                        regFrom = checkGPR(memory.load(++self.ip));
                        self.gpr[regTo] = checkOperation(self.gpr[regTo] | self.gpr[regFrom]);
                        self.ip++;
                        break;
                    case opcodes.OR_REGADDRESS_WITH_REG:
                        regTo = checkGPR(memory.load(++self.ip));
                        regFrom = memory.load(++self.ip);
                        self.gpr[regTo] = checkOperation(self.gpr[regTo] | memory.load(indirectRegisterAddress(regFrom)));
                        self.ip++;
                        break;
                    case opcodes.OR_ADDRESS_WITH_REG:
                        regTo = checkGPR(memory.load(++self.ip));
                        memFrom = memory.load(++self.ip);
                        self.gpr[regTo] = checkOperation(self.gpr[regTo] | memory.load(memFrom));
                        self.ip++;
                        break;
                    case opcodes.OR_NUMBER_WITH_REG:
                        regTo = checkGPR(memory.load(++self.ip));
                        number = memory.load(++self.ip);
                        self.gpr[regTo] = checkOperation(self.gpr[regTo] | number);
                        self.ip++;
                        break;
                    case opcodes.XOR_REG_WITH_REG:
                        regTo = checkGPR(memory.load(++self.ip));
                        regFrom = checkGPR(memory.load(++self.ip));
                        self.gpr[regTo] = checkOperation(self.gpr[regTo] ^ self.gpr[regFrom]);
                        self.ip++;
                        break;
                    case opcodes.XOR_REGADDRESS_WITH_REG:
                        regTo = checkGPR(memory.load(++self.ip));
                        regFrom = memory.load(++self.ip);
                        self.gpr[regTo] = checkOperation(self.gpr[regTo] ^ memory.load(indirectRegisterAddress(regFrom)));
                        self.ip++;
                        break;
                    case opcodes.XOR_ADDRESS_WITH_REG:
                        regTo = checkGPR(memory.load(++self.ip));
                        memFrom = memory.load(++self.ip);
                        self.gpr[regTo] = checkOperation(self.gpr[regTo] ^ memory.load(memFrom));
                        self.ip++;
                        break;
                    case opcodes.XOR_NUMBER_WITH_REG:
                        regTo = checkGPR(memory.load(++self.ip));
                        number = memory.load(++self.ip);
                        self.gpr[regTo] = checkOperation(self.gpr[regTo] ^ number);
                        self.ip++;
                        break;
                    case opcodes.NOT_REG:
                        regTo = checkGPR(memory.load(++self.ip));
                        self.gpr[regTo] = checkOperation(~self.gpr[regTo]);
                        self.ip++;
                        break;
                    case opcodes.SHL_REG_WITH_REG:
                        regTo = checkGPR(memory.load(++self.ip));
                        regFrom = checkGPR(memory.load(++self.ip));
                        self.gpr[regTo] = checkOperation(self.gpr[regTo] << self.gpr[regFrom]);
                        self.ip++;
                        break;
                    case opcodes.SHL_REGADDRESS_WITH_REG:
                        regTo = checkGPR(memory.load(++self.ip));
                        regFrom = memory.load(++self.ip);
                        self.gpr[regTo] = checkOperation(self.gpr[regTo] << memory.load(indirectRegisterAddress(regFrom)));
                        self.ip++;
                        break;
                    case opcodes.SHL_ADDRESS_WITH_REG:
                        regTo = checkGPR(memory.load(++self.ip));
                        memFrom = memory.load(++self.ip);
                        self.gpr[regTo] = checkOperation(self.gpr[regTo] << memory.load(memFrom));
                        self.ip++;
                        break;
                    case opcodes.SHL_NUMBER_WITH_REG:
                        regTo = checkGPR(memory.load(++self.ip));
                        number = memory.load(++self.ip);
                        self.gpr[regTo] = checkOperation(self.gpr[regTo] << number);
                        self.ip++;
                        break;
                    case opcodes.SHR_REG_WITH_REG:
                        regTo = checkGPR(memory.load(++self.ip));
                        regFrom = checkGPR(memory.load(++self.ip));
                        self.gpr[regTo] = checkOperation(self.gpr[regTo] >>> self.gpr[regFrom]);
                        self.ip++;
                        break;
                    case opcodes.SHR_REGADDRESS_WITH_REG:
                        regTo = checkGPR(memory.load(++self.ip));
                        regFrom = memory.load(++self.ip);
                        self.gpr[regTo] = checkOperation(self.gpr[regTo] >>> memory.load(indirectRegisterAddress(regFrom)));
                        self.ip++;
                        break;
                    case opcodes.SHR_ADDRESS_WITH_REG:
                        regTo = checkGPR(memory.load(++self.ip));
                        memFrom = memory.load(++self.ip);
                        self.gpr[regTo] = checkOperation(self.gpr[regTo] >>> memory.load(memFrom));
                        self.ip++;
                        break;
                    case opcodes.SHR_NUMBER_WITH_REG:
                        regTo = checkGPR(memory.load(++self.ip));
                        number = memory.load(++self.ip);
                        self.gpr[regTo] = checkOperation(self.gpr[regTo] >>> number);
                        self.ip++;
                        break;
                    default:
                        throw "Invalid op code: " + instr;
                }

                return true;
            } catch(e) {
                self.fault = true;
                throw e;
            }
        },

    };

    cpu.reset();
    return cpu;
}]);