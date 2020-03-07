const fs   = require('fs');
const util = require('util');


const files = [
  'temp/sample.txt',
  'temp/sample1.txt',
  'temp/sample2.txt',
];

// create a promise version of function
const readFile = util.promisify( fs.readFile );

// map the files to the readFile function,
// creating an array of promises
const promises = files.map(
    file => readFile(`${__dirname}/${file}`, 'utf8')
);

Promise.all(promises)
  .then(data => {
      // array of results in order of executing promise
      data.forEach( text => console.log(text) );
  })
  .catch( error => {
      // if some error happens no one of promises will resolve
      console.log('err: ', error)
  });
