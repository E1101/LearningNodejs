const util = require('util')
const isPrime = require('./04-is-prime-sqrt')

// This is similar to if we were to use setTimeout(fn, 0),
// however if setTimeout() is called with a delay less than 1,
// it will use a delay of 1 millisecond. setImmediate() does not
// use a fixed delay, it will only wait until the next cycle of
// the event loop.
// ---
// In broad strokes, what we need to do is limit the amount of
// time our findPrimes() function is allowed to search for primes
// in a blocking manor. Once that time is exceeded, we pause execution
// and use setImmediate() to wait until the next cycle of the event
// loop to continue. During this pause, any outstanding work that has
// been queued up can be completed. Instead of blocking the thread for a
// single continuous block of time, our function will only block for
// "bursts" and free up our process to handle other work in between.

// We are using setImmediate() along with util.promisify()
// so that we can introduce a delay with await.
const setImmediatePromise = util.promisify(setImmediate)

// instead of getting an array of primes as the return value, we'll get a promise.
// Because loops and math operations are synchronous, we need to take advantage of
// a Node.js method so that we don't block.
module.exports = function findPrimes(nStart, count, primes = []) {
  return new Promise(async function (resolve, reject) {
    await setImmediatePromise()

    const { found, remaining, nLast } = findPrimesTimed(nStart, count, 25)
    primes = primes.concat(found)

    if (!remaining) return resolve(primes)

    resolve(findPrimes(nLast, remaining, primes))
  })
}

function findPrimesTimed(nStart, count, duration) {
  let nLast = nStart
  const found = []

  const breakTime = Date.now() + duration

  while (found.length < count && Date.now() < breakTime) {
    nLast++
    if (isPrime(nLast)) found.push(nLast)
  }

  const remaining = count - found.length
  return { found, nLast, remaining }
}
