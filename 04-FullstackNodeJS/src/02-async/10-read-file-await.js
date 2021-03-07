const fs = require('fs').promises

printLength('10-read-file-await.js')

// The `async` and `await` keywords allow us to treat specific
// uses of promises as if they were synchronous.
async function printLength (file) {
  try {
    // await allows us to treat promises as synchronous.
    const data = await fs.readFile(file)
    console.log(`${file}: ${data.length}`)
  } catch (err) {
    console.error(err)
  }
}
