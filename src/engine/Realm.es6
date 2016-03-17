const Operations = {

    PLUS: (a, b) => (a + b)
    ,
    MINUS: (a, b) => PLUS(a, -b)
    ,
    EQ: (a, b) => (a === b)
    ,
    LIKE: (a, b) => EQ(`${a}`, `${b}`)

};