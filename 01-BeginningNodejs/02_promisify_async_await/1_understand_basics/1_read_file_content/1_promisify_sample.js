// the script uses promisify() to convert the
// callback-based function fs.readFile() to the
// Promise-based function readFileAsync().

const {promisify} = require('util');

const fs = require('fs');
const readFileAsync = promisify(fs.readFile);

const filePath = process.argv[2];

readFileAsync(filePath, {encoding: 'utf8'})
    .then((text) => {
        console.log('CONTENT:', text);
    })
    .catch((err) => {
        console.log('ERROR:', err);
    });
