// we're going to watch process.stdin, a data source that will contain any
// text that a user types in while our Node.js app is running, and we're
// going to receive message events any time the user presses "return."
const readline = require('readline')

const rl = readline.createInterface({ input: process.stdin })

rl.on('line', line => console.log(line.toUpperCase()))
