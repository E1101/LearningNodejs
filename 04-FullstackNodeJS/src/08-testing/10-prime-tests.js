const got = require('got')

const { isEqual, finish } = require('./07-simple-test')

const isPrime = require('./04-is-prime-sqrt')
const findPrimes = require('./08-find-primes-async')
const createServer = require('./10-prime-server')

runTests()

async function runTests () {
  isPrimeTests()
  await findPrimeTests()
  await primeServerTests()

  finish()
}

function isPrimeTests () {
  isEqual(isPrime(2), true, '2 should be prime')
  isEqual(isPrime(3), true, '3 should be prime')
  isEqual(isPrime(4), false, '4 should not be prime')
  isEqual(isPrime(5), true, '5 should be prime')
  isEqual(isPrime(9), false, '9 should not be prime')
  isEqual(isPrime(200), false, '200 should not be prime')
  isEqual(isPrime(1489), true, '1489 should be prime')
  isEqual(isPrime(2999), true, '2999 should be prime')
}

async function findPrimeTests () {
  const primes = await findPrimes(1000, 5)
  isEqual(
    primes,
    [1009, 1013, 1019, 1021, 1031],
    'should find 5 primes greater than 1000'
  )
}

// Here we can see that the test gets to choose the port the server listens on,
// when the server starts up, and when the server is closed, which will allow the
// process to exit (instead of hang like it did previously).
async function primeServerTests () {
  const port = 3456
  const server = createServer().listen(port)
  const origin = `http://localhost:${port}`
  const url = `${origin}/find-primes?nStart=1000&count=5`

  const primes = await got(url).json()
  isEqual(
    primes,
    [1009, 1013, 1019, 1021, 1031],
    'should find 5 primes greater than 1000 from API'
  )

  server.close()
}
