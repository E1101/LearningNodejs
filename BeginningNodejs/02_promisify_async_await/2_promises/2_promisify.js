const fs   = require('fs');
const util = require('util');

// takes a function that following the common Node.js callback style, (err, value) => … callback
// and returning Promise version of that
const readFile = util.promisify( fs.readFile );

readFile(`${__dirname}/temp/sample.txt`, 'utf8')
  .then( data => console.log(data) )
  .catch( error => console.log('err: ', error) );
