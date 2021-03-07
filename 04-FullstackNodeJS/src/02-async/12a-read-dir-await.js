const fs = require('fs').promises

printLengths('./')

async function printLengths (dir) {
  const fileList = await fs.readdir(dir)
  // Once we convert the array of promises to a single promise, we can use await as we expect.
  const results = await Promise.all(
    fileList.map(file => fs.readFile(file).then(data => [file, data.length]))
  )
  results.forEach(([file, length]) => console.log(`${file}: ${length}`))
  console.log('done!')
}
