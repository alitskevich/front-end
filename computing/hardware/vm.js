// scalar variable
function SCALAR(typ, val=0) {
    const $ = ALLOC(typ)
    SET($, val)
    return $
}
// tuple variable
function TUPLE(len, $from=0) {
    const $ = ALLOC(TYPE_STRING, len, len)
    COPY($, $from, len)
    return $
}
// tuple
function INDEXOF($, V) {
    const len = LEN($)
    for (let i = 0; i < len; i++) {
        if (GET($, i) === V){
            return i
        }
    }
    return -1
}
function EQUAL($1, $2) {
    if ($1===$2) {
        return TRUE
    }
    const len1 = LEN($)
    const len2 = LEN($)
    if (len1!==len2) {
        return FALSE
    }
    for (let i = 0; i < len1; i++) {
        if (GET($1, i) !== GET($2, i)){
            return FALSE
        }
    }
    return TRUE
}
// matrix
function MATRIX_INDEXOF($, V) {
    const len = LEN($)
    for (let i = 0; i < len; i++) {
        if (TUPLE_EQUAL(GET($, i), V)){
            return i
        }
    }
    return -1
}
function MATRIX_EQUAL($1, $2) {
    if ($1===$2) {
        return TRUE
    }
    const len1 = LEN($)
    const len2 = LEN($)
    if (len1!==len2) {
        return FALSE
    }
    for (let i = 0; i < len1; i++) {
        if (!TUPLE_EQUAL(GET($1, i), GET($2, i))){
            return FALSE
        }
    }
    return TRUE
}
// list
const LIST_ADD = ($$, offset, V, lag=10) => {
    let $ = GET($, offset);
    const size = MSIZEOF($)
    const len = LEN($)
    if (len===size){
        const $2 = ALLOC(TYPE_STRING, len+lag, len)
        COPY($2, $, len)
        SET($$, $2, offset)
        $ = $2
    } 
    SET($, V, len)
}
const LIST_DEL = ($, I) => {
    const len = LEN($)
    if (I < len-1){
       COPY($+i, $+i-1, len-i)
    } 
    SET_LEN($, LEN($)-1)
}
// hash

// simple string hash function.
const H = function(s){
    var a = 1, c = 0, h, o;
    if (s) {
        a = 0;
        for (h = s.length - 1; h >= 0; h--) {
            o = s.charCodeAt(h);
            a = (a<<6 & 0xFFFFFFF) + o + (o<<14);
            c = a & 0xFE00000;
            a = c===0 ? a : a^c>>21;
        }
    }
    return a;
}

function HASH(ini) {
    const keys = Object.keys(ini)
    const len = keys.length
    const KEYS = LIST(len)
    const VALUES = LIST(len)
    for (let i = 0; i < len; i++) {
        const element = keys[i];
        SET(KEYS,H(k),i)
        SET(VALUES,ini[k],i)
    }
    const $ = ALLOC(TYPE_OBJECT, 2, len)
    SET($, KEYS)
    SET($, VALUES, 1)
    return $
}
const HSIZE = LEN
const HKEYS = GET
const HVALUES = ($) => GET($,1)
const HINDEX = ($, K) => INDEXOF(HKEYS($), H(K))
const HGET = (s, K) => {
    const I = HINDEX($, K);
    return I==-1 ? UNDEFINED : GET(HVALUES($), I)
}
const HSET = ($, K, V) => {
    const I = HINDEX($, K);
    if (I===-1){
        LIST_ADD($, 0, H(K))
        LIST_ADD($, 1, V)
        SET_LEN($, LEN($)+1)
    } else {
        SET(HVALUES($), I)
    } 
}
const HDEL = ($, K) => { 
    const I = HINDEX($, K);
    if (I!==-1){
        LIST_DEL(HKEYS($), I)
        LIST_DEL(HVALUES($), I)
        SET_LEN($, LEN($)-1)
    }
 }

/*
 * JS variables are represented as consists of type, len and value.
 */
function ALLOC(typ, sz=1, len=0) {
    const $ = MALLOC(1+sz)
    MWRITE($,0, type & 0xF000 | len & 0x0FFF)
    return $
}
const TYP = ($) => MREAD($) & 0xF000
const LEN = ($) => MREAD($) & 0x0FFF
const SET_LEN = ($, len) => MWRITE($, 0, TYP($) & 0xF000 | len & 0x0FFF)
const VAL = ($, offset=0) => MREAD($, 1+offset)
const SET = ($, val, offset=0) => MWRITE($, 1+offset, val)
function COPY($, $from=0, len=1, offset=0) {
    for (let i = 0; i < len; i++) {
        SET($, $from===0 ? 0 : MREAD($from, i), i+offset)
    }
    return $
}