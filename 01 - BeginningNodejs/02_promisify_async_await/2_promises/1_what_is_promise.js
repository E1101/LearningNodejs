const fs = require('fs');

// Convert a callback function to a Promise one
// define readFile as function that will return a Promise
const readFile = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err)
        // reject promise with error
        reject(err);
      else
        // resolve the success result to promise
        resolve(data);
    });
  });
};

// call the async function
readFile(`${__dirname}/temp/sample.txt`)
  .then(data => console.log(data))
  .catch(error => console.log('err: ', error.message));
