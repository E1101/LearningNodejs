const got = require('got')
const getPort = require('get-port')

const { isEqual, finish } = require('./07-simple-test')

const isPrime = require('./04-is-prime-sqrt')
const findPrimes = require('./08-find-primes-async')
const createServer = require('./13-prime-server')

// we'll refactor our test a bit so that we'll create a single server
// instance and share with any test that needs it. Then, we can use try/catch
// so that if we do run into an error, we can still be sure to use close() on
// the server instance so that the test process can end without hanging

runTests()

async function runTests () {
  const port = await getPort()
  const server = createServer().listen(port)
  const origin = `http://localhost:${port}`

  try {
    isPrimeTests()
    await findPrimeTests()
    await primeServerTests(origin)
    await largestPrimeTest(origin)
  } catch (err) {
    isEqual(err, false, `Unexpected Error: ${err.message}`)
  }

  server.close()
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

async function primeServerTests (origin) {
  const urlSlow = `${origin}/find-primes?nStart=1&count=35000`
  const urlFast = `${origin}/is-prime?n=2`

  const timeStart = Date.now()
  return new Promise(function (resolve, reject) {
    const responses = {}
    got(urlSlow).json().then(() => {
      responses.slow = Date.now() - timeStart
      if (responses.fast) onFinish()
    })

    got(urlFast).json().then(() => {
      responses.fast = Date.now() - timeStart
      if (responses.slow) onFinish()
    })

    function onFinish () {
      const correctOrder = responses.fast < responses.slow
      isEqual(correctOrder, true, 'should get fast response before slow')
      resolve()
    }
  })
}

async function largestPrimeTest (origin) {
  const urlFind = `${origin}/find-primes?nStart=1&count=5`
  const foundPrimes = await got(urlFind).json()
  isEqual(foundPrimes, [ 2, 3, 5, 7, 11 ], 'should find primes via endpoint')

  const urlLargest = `${origin}/largest-prime`
  const largest = await got(urlLargest).json()
  isEqual(largest, 11, 'should get largest prime via endpoint')
}
