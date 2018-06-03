// https://schweigi.github.io/assembler-simulator/
const resolveArg=(s, labels)=>{
    const r={type:'VAL', s}
    if (s[0]==='[') {
        r.type="ADDR"
        s = r.s = s.slice(1,-1)
    }
    if (s==='A' || s==='B' || s==='C' || s==='D') {
        r.type = r.type==='VAL'?'REG':'REGADDR'
        r.val = s.charCodeAt(0) - 'A'.charCodeAt(0) + 2
    } else if (labels[s]) {
        r.val = labels[s]
    } else {
        r.type="VAL"
        r.val = +s
    }
    return r
}

export class Assembler {

    assemble(source, opset){
        const parsed = this.parse(source)
        const bytes = parsed.bytes = [0,0]
        const offset = parsed.db.length+1
        const labels = parsed.labels = {}
        parsed.db.forEach((e, index)=> {
            labels[e.label] = bytes.length;
            bytes.push(...e.value.map(a=>a.charCodeAt(0)))
            bytes.push(0)
        })
        bytes[0] = opset('JMP_VAL')
        bytes[1] = bytes.length

        parsed.code.forEach((e, index)=>{
            e.addr = bytes.length
            if (e.label){
                labels[e.label] = e.addr;
            }
            bytes.push(e.command)
            bytes.push(...e.args.map(a=>0))
        });
        parsed.code.forEach((e,index)=>{
            e.args = e.args.map(s=>resolveArg(s, labels))
        })
        parsed.code.forEach((e,index)=>{
            bytes[e.addr] = opset([e.command, ...e.args.map(a=>a.type)].join('_'))
            e.args.forEach((a,i)=>{bytes[e.addr+i+1]=a.val})
        })
        return parsed
    }
    parse(source){
        const code = []
        const db = []
        source.replace(/;.*/g,'').replace(/([a-z\.]+:\s+?)?([A-Z]+)([ ]+.*\S)?/g,
        function(l, label, command, ops){
            label = (label||'').trim().replace(':','')
            ops = (ops||'').trim()
            command = command.toUpperCase()
            if (command==='DB') {
                db.push({ label, value: ops.slice(1,-1).split('').map(c=>c.charAt(0)) })
            } else {
                code.push({ label, command, args: ops?ops.split(',').map(s=>s.trim()):[] })
            }
        })
        return {code, db}
    }
}