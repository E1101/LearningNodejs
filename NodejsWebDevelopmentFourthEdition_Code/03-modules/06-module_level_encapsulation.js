const util = require('util');
const A    = "1_understand_async different value A";
const B    = "1_understand_async different value B";

const m1   = require('./_module1');

// A=1_understand_async different value A B=1_understand_async different value B values={ A: 'value A', B: 'value B' }
console.log(
    `A=${A} B=${B} values=${util.inspect(m1.values())}`
);

// undefined undefined
console.log(
    `${m1.A} ${m1.B}`
);


const vals = m1.values();
vals.B = "something completely different";

// { A: 'value A', B: 'something completely different' }
console.log( util.inspect(vals) );

// { A: 'value A', B: 'value B' }
console.log( util.inspect(m1.values()) );

