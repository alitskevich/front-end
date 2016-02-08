const Operations = {
    PLUS: (a, b) => (a + b)
    ,
    MINUS: (a, b) => PLUS(a, -b)
    ,
    EQ: (a, b) => (a === b)
    ,
    EQ2: (a, b) => EQ(`${a}`, `${b}`)


};