// physical central processing unit
// @see https://schweigi.github.io/assembler-simulator/instruction-set.html
export function PHY_CPU(R,W){
    
    // general-purpose registries
    const REG_NAMES = 'IP,SP,AX,BX,CX,DX'.split(',').reduce((r,e,i)=>((r[e]=i), r),{})
    const { IP, SP } = REG_NAMES
    const REG_LEN = Object.keys(REG_NAMES).length
    const REGISTRIES = Array.apply(null,Array(REG_LEN)).map(i=>0)
    // returns value at current address and increments pointer to.
    const NEXT = ()=> R(REGISTRIES[IP]++)
    const HLT = () => (cpu.IS_HALT = 0x1)
    let ticks = 100
    // CPU instance
    const byName = {}
    const byIndex = {}
    const cpu = {
        SET_SP: (V)=>{REGISTRIES[SP]=V},
        IS_HALT: 0x0,
        OPCODE: (mnemocode) => {try { return byName[mnemocode].index } catch(ex){ throw new Error(`Op not exists: ${mnemocode}`)}},
        TICK: ()=> {
            const ip = REGISTRIES[IP]
            const code = NEXT()
            const op = byIndex[code]
            if (op) {
                console.log('TICK:'+ip, op.name)
                op.operation()
            } else {
                console.error('OP not found: '+code)
            }
            if (!(ticks--)) {
                HLT()
            }
        }
    }
    
    // flags bits
    function FLAGS(X) {
        cpu.IS_ZERO = X === 0 ? 1 : 0;
        cpu.IS_CARRY = X < 0 || X > 255 ? 1 : 0;
        cpu.IS_FAULT = isNaN(X) ? 1 : 0;
        return X;
    }
    
    // assign value
    const MOV= (A, B) => B
    const CMP= (A, B) => { FLAGS(A === B ? 0 : 0x1) }    
    // arithmetic
    const ADD= (A, B) => FLAGS(A + B)
    const SUB= (A, B) => FLAGS(A - B)
    const MUL= (A, B) => FLAGS(A * B)
    const DIV= (A, B) => FLAGS(A / B)
    const INC= A => ADD(A, 0x1)
    const DEC= A => SUB(A, 0x1)
    // logical
    const NOT= A => A === 0 ? 0x1 : 0
    const AND= (A, B) => FLAGS(A && B)
    const OR = (A, B) => FLAGS(A || B)
    // bitwise
    const XOR= (A, B) => FLAGS(A | B)
    const XAND= (A, B) => FLAGS(A & B)
    const SHL= (A, B) => FLAGS(A << B)
    const SHR= (A, B) => FLAGS(A >> B)
    // control flow
    const JMP = $ => (REGISTRIES[IP] = $)
    const JC = $ => cpu.IS_CARRY === 0x1 && JMP($)
    const JNC = $ => cpu.IS_CARRY === 0 && JMP($)
    const JZ = $ => cpu.IS_ZERO === 0x1 && JMP($)
    const JNZ = $ => cpu.IS_ZERO === 0 && JMP($)
    const JA = $ => cpu.IS_CARRY + cpu.IS_ZERO !== 0 && JMP($)
    const JNA = $ => cpu.IS_CARRY + cpu.IS_ZERO === 0 && JMP($)
    // stack
    const PUSH = (V) => { W(--REGISTRIES[SP], V) }
    const POP = ($T) => { W($T, R(REGISTRIES[SP]++)) }
    // proc
    const RET= () => { REGISTRIES[IP] = R(REGISTRIES[SP]++) }
    const CALL = $ => { PUSH(REGISTRIES[IP]); JMP($) }

    // data accessors
    const DATA_ACCESSORS = {
        VAL: V => V,
        REG : $ => REGISTRIES[$],
        ADDR : $ => R($),
        REGADDR : $ => R(REGISTRIES[$])
    }
    const DATA_ACCESSORS_KEYS = Object.keys(DATA_ACCESSORS)
    const DATA_ACCESSORS_KEYS2 = [].concat(...DATA_ACCESSORS_KEYS.map(k1=>DATA_ACCESSORS_KEYS.map(k2=>({k1, k2}))))
    const DATA_ACCESSORS_KEYS2_NAMES = DATA_ACCESSORS_KEYS2.map(({k1,k2})=>`${k1}_${k2}`).join(' ')
    const{ REG, REGADDR, ADDR, VAL } = DATA_ACCESSORS
    // modifiers
    const SET_ADDR2 = (fn, op2) => ($=NEXT()) => W($, fn(R($), op2(NEXT())))
    const SET_REGADDR2 = (fn, op2) => ($=REG(NEXT())) => W($, fn(R($), op2(NEXT())))
    const SET_REG2 = (fn, op2) => ($=NEXT()) => (REGISTRIES[$] = fn(REG($), op2(NEXT()) ))
    
    // modes
    const MODES = {
        // transparent
        NOPE: fn => fn,
        // unary
        VAL: fn => ($=NEXT()) => fn($),
        REG: fn => ($=NEXT()) => fn(REG($)),
        ADDR: fn => ($=NEXT()) => fn(ADDR($)),
        REGADDR: fn => ($=NEXT()) => fn(REGADDR($)),

        SET_REG: fn => ($=NEXT()) => (REGISTRIES[$] = fn(REG($))),
        SET_ADDR: fn => ($=NEXT()) => W($, fn(R($))),
        SET_REGADDR: fn => ($=REG(NEXT())) => W($, fn(R($))),
        // binary for address
        ...( DATA_ACCESSORS_KEYS.reduce((r,k)=>{ r[`ADDR_${k}`] = fn => SET_ADDR2(fn, DATA_ACCESSORS[k]); return r}, {}) ),
        // binary for reg address
        ...( DATA_ACCESSORS_KEYS.reduce((r,k)=>{ r[`REGADDR_${k}`] = fn => SET_REGADDR2(fn, DATA_ACCESSORS[k]); return r}, {}) ),
        // binary for reg
        ...( DATA_ACCESSORS_KEYS.reduce((r,k)=>{ r[`REG_${k}`] = fn => SET_REG2(fn, DATA_ACCESSORS[k]); return r}, {}) ),
        // binary for CMP
        ...(DATA_ACCESSORS_KEYS2.reduce((r,{k1,k2})=>{ r[`CMP_${k1}_${k2}`] = fn => () => fn(DATA_ACCESSORS[k1](NEXT()), DATA_ACCESSORS[k2](NEXT())); return r}, {}) ),
    }
    // populate opset registry
    const DEF = [
        // halt
        {id: 'HLT', op: HLT},
        // compare 
        {id: 'CMP', op:CMP, modes:DATA_ACCESSORS_KEYS2.map(({k1,k2})=>`CMP_${k1}_${k2}`).join(' ')},
        // binary
        {id: 'MOV', op:MOV, modes:DATA_ACCESSORS_KEYS2_NAMES},
        {id: 'ADD', op:ADD, modes:DATA_ACCESSORS_KEYS2_NAMES},
        {id: 'SUB', op:SUB, modes:DATA_ACCESSORS_KEYS2_NAMES},
        {id: 'MUL', op:MUL, modes:DATA_ACCESSORS_KEYS2_NAMES},
        {id: 'DIV', op:DIV, modes:DATA_ACCESSORS_KEYS2_NAMES},
        {id: 'AND', op:AND, modes:DATA_ACCESSORS_KEYS2_NAMES},
        {id: 'OR',  op:OR,  modes:DATA_ACCESSORS_KEYS2_NAMES},
        {id: 'XOR', op:XOR, modes:DATA_ACCESSORS_KEYS2_NAMES},
        {id: 'SHL', op:SHL, modes:DATA_ACCESSORS_KEYS2_NAMES},
        {id: 'SHR', op:SHR, modes:DATA_ACCESSORS_KEYS2_NAMES},
        // unary
        {id: 'INC', op:INC, modes:'SET_REG SET_REGADDR SET_ADDR'},
        {id: 'DEC', op:DEC, modes:'SET_REG SET_REGADDR SET_ADDR'},
        {id: 'NOT', op:NOT, modes:'SET_REG SET_REGADDR SET_ADDR'},
         // control flow
        {id: 'JMP', op:JMP, modes:'VAL REG REGADDR ADDR'},  
        {id: 'JC',  op:JC,  modes:'VAL REG REGADDR ADDR'},
        {id: 'JNC', op:JNC, modes:'VAL REG REGADDR ADDR'},
        {id: 'JZ',  op:JZ,  modes:'VAL REG REGADDR ADDR'},
        {id: 'JNZ', op:JNZ, modes:'VAL REG REGADDR ADDR'},
        {id: 'JA',  op:JA,  modes:'VAL REG REGADDR ADDR'},
        {id: 'JNA', op:JNA, modes:'VAL REG REGADDR ADDR'},
        // procedure call/return
        {id: 'CALL', modes:'VAL REG REGADDR ADDR', op:CALL},
        {id: 'RET', op:RET},
        // stack
        {id: 'PUSH', modes:'VAL REG REGADDR ADDR', op: PUSH},
        {id: 'POP', modes:'SET_REG SET_REGADDR SET_ADDR', op: POP}
    ]
    let code = 0
    DEF.forEach(({id, op, modes='NOPE'}) => modes.split(' ').forEach((mode)=> {
        const name = mode === 'NOPE' ? id : (id === 'CMP' ? mode : `${id}_${mode.replace('SET_','')}`)
        const index = code++
        const mod = MODES[mode]
        if (mod) {
            const operation = mod(op)
            byName[name] = byIndex[index] = { operation, name, index }
        }
    }))
    return cpu
}   