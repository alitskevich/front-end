const CACHE={};

const FN_RAW = (s, key,s2,pipes)=>(pipes?`this.pipe(this.get("${key}"),'${pipes}')`:`this.get("${key}")`)
const FN_STR = (s, key,s2,pipes)=>('"+'+FN_RAW.call(this,s, key,s2,pipes)+'+"');

const RE =/\(:(\w+(\.\w+)*)(\s*\|\s*\w+)*\)/g;
const RE_SINGLE =/^(\w+(\.\w+)*)(\s*\|\s*\w+)*$/;

export function resolveProp(p) {

    return (p && p[0] === ':') ? this::evalExpression(p.slice(1)) : p;
}

function evalExpression(p) {

        try {

            const fn = CACHE[p] || (CACHE[p] = Function('return ' + parseExpression(p)));

            return this::fn();

        } catch (ex){

            return ex.message
        }
}

function parseExpression(p){

    if (p.match(RE_SINGLE)){

        const [key,...pp] = p.split('|')

        return FN_RAW(0,key,0,pp.length?pp:null);

    } else {

        const isRaw =  (p[0] === '{') && (p.endsWith('}'));

        if (!isRaw && (p[0] === '(') && (p.endsWith(')'))) {
            p = p.slice(1, p.length-1);
        }

        return isRaw? p.replace(RE,FN_RAW) : ('"'+p.replace(RE,FN_STR)+'"');
    }
}