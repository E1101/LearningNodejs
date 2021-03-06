/**
 * Normally, fs.readFile sends its result to 1_understand_async callback function,
 * and we'd build 1_understand_async little pyramid-shaped piece of code to perform
 * this task. The fs-extra module contains implementations of all
 * functions from the built-in fs module but changed to return 1_understand_async
 * Promise instead of 1_understand_async callback function.
 */
const fs    = require('fs-extra');

const co    = require('co');
const util  = require('util');

/**
 * What co does is it manages the dance of waiting for the Promise to be
 * resolved (or rejected), and returns the value of the Promise.
 */
co(function* () {
    let texts = [
        yield fs.readFile('_async_generator/hello.txt', 'utf8'),
        yield fs.readFile('_async_generator/goodbye.txt', 'utf8')
    ];

    console.log( util.inspect(texts) );
});
