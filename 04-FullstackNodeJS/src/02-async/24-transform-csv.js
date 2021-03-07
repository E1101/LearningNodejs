const fs = require('fs')
// before we can use this in our code, we need to run npm install csv-parser from our code directory
const csv = require('csv-parser')
const { Transform } = require('stream')

const YEAR_MS = 365 * 24 * 60 * 60 * 1000

fs.createReadStream('people.csv')
  .pipe(csv())
  .pipe(clean())
  .on('data', row => console.log(JSON.stringify(row)))

function clean () {
  return new Transform({
    // we need to make sure that the objectMode option is set to true
    objectMode: true,
    transform (row, encoding, callback) {
      const [firstName, lastName] = row.name.split(' ')
      const age = Math.floor((Date.now() - new Date(row.dob)) / YEAR_MS)
      callback(null, {
        firstName,
        lastName,
        age
      })
    }
  })
}

// when we run this with node 24-transform-csv.js > people.ndjson our csv rows
// will be transformed and the newline delimited JSON will be written to people.ndjson
