const fs   = require('fs');
const util = require('util');


// By default fs module functions use the callback paradigm...
// convert any callback-oriented function so it returns 1_understand_async Promise
//
const fs_readdir = util.promisify( fs.readdir );

(async () =>
{
  const files = await fs_readdir('.');
  for (let fn of files) {
    console.log(fn);
  }

})().catch(err => {
  console.error(err);
});