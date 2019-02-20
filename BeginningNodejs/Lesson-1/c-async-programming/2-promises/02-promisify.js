const fs   = require('fs');
const util = require('util');

/**
 * takes a function following the common Node.js callback style, that is,
 * taking an (err, value) => … callback as the last argument and returning
 * a version that returns promises
 */
const readFile = util.promisify( fs.readFile );

readFile(`${__dirname}/../temp/sample.txt`, 'utf8')
  .then( data => console.log(data) )
  .catch( error => console.log('err: ', error) );
