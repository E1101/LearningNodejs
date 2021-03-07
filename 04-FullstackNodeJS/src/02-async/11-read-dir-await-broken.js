const fs = require('fs').promises

printLengths('./')

async function printLengths (dir) {
  const fileList = await fs.readdir(dir)

  const results = fileList.map(
    async file => await fs.readFile(file).then(data => [file, data.length])
  )

  results.forEach(result => console.log(`${result[0]}: ${result[1]}`))

  console.log('done!')
}

/*
❯ node 11-read-dir-await-broken.js
undefined: undefined
undefined: undefined
undefined: undefined
undefined: undefined
undefined: undefined
...
 */

// Even though we specify the iterator function as async so that we can use
// await each time we call fs.readFile(), we can't use await on the call to
// fileList.map() itself. This means that Node.js will not wait for each promise
// within the iterator to complete before moving on. Our dataFiles array will not
// be an array of file data; it will be an array of promises.
