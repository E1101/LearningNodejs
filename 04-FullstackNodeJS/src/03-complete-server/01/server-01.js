const fs = require('fs').promises
const path = require('path')
const express = require('express')

const port = process.env.PORT || 1337

const app = express()
app.get('/products', listProducts)
app.listen(port, () => console.log(`Server listening on port ${port}`))

async function listProducts (req, res) {
  const productsFile = path.join(__dirname, '../products.json')
  try {
    // fs.readFile() will resolve relative paths using the current working directory. This means that
    // our code will look in different places for a file depending on which directory we run the code from.
    // For example, let's imagine that we have created files /Users/fullstack/project/example.js and
    // /Users/fullstack/project/data.txt, and in example.js we had fs.readFile('data.txt', console.log).
    // If we were to run node example.js from within /Users/fullstack/project, the data.txt would be loaded
    // and logged correctly. However, if instead we were to run node project/example.js from /Users/fullstack,
    // we would get an error. This is because Node.js would unsuccessfully look for data.txt in the /Users/fullstack
    // directory, because that is our current working directory.
    const data = await fs.readFile(productsFile)
    // res.json() will both automatically set the appropriate content-type header and format the response for us.
    res.json(JSON.parse(data))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
