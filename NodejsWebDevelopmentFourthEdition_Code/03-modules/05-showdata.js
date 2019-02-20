/*
 * It is equivalent to this code:
 *
 * --- data.json ---------------------
 * const fs = require('fs');
 * module.exports = JSON.parse(
 *    fs.readFileSync('/path/to/file-name.json', 'utf8') );
 */
const data = require('./_data');

const util = require('util');

console.log(
    util.inspect(data) // Tries to print the value out in the best way possible given the different types.
);
