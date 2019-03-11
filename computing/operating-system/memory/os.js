function OS_INSTALL(device) {
    const {R,W,OPS} =device
    // stack
    const PUSH = (val=0) => {
        const $ = R(SP) - 1
        if ( $ < 0 ) HALT('Stack overflow')
        W(SP, $)
        W($, val)
        return $
    }
    const POP = () => {
        const $ = R(SP)
        const val = R($)
        W(SP, $+1)
        return val
    }
    const TOP = (offset=0) => R(R(SP)+offset)
    
    // heap
    const MALLOC = (size) => { 
        const $ = NEXT_FREE_$
        NEXT_FREE_$+=size+1
        W($, size)
        return $
    }
    const MSIZEOF = p => BLOCKS[p][1]
    const MREAD = (p, offset=0) => R(BLOCKS[p][0]+offset)
    const MWRITE = (p, offset=0, val=0) => W(BLOCKS[p][0]+offset, val)
    const MFILL = (p, val=0) => {
        const len = MSIZEOF(p)
        for (let i = 0; i < len; i++) {
            W(BLOCKS[p][0]+i, val)
        }
    }
    
    // procedure call/return
    const CALL = ($) => {
        PUSH(R(IP)+1)
        JMP($)
    }
    const RET = (val) => {
        W(AX, val)
        const $ = POP(SP)
        JMP($)
    }

    const API = {
        MALLOC,
        PUSH,ROP,TOP,
        CALL, RET
    }

    return {
        Run(program, ...args){
            W(SP, STACK_SIZE)
            W(IP, STACK_SIZE)
            for (let i = 0; i < CODE.length; i++) {
              W(STACK_SIZE+i, CODE[i]);
            }
            program.compile(API).run(...args)
        }
    }
}