let count = 0
setInterval(() => console.log(`${++count} mississippi`), 1000)

setTimeoutSync(5500)
console.log('hello from the past!')
process.exit()

// We've created our own setTimeoutSync() function that
// will block execution for the specified number of milliseconds.
function setTimeoutSync (ms) {
  const t0 = Date.now()
  while (Date.now() - t0 < ms) {}
}

/*
❯ node 02-configuration_management-creating_an_auth_module-validation-modulize-set-timeout-sync.js
hello from the past!
 */

// Node.js is non-blocking by default, but as we can see, it's still possible to block.
// Node.js is single-threaded, so long running loops like the one in setTimeoutSync() will
// prevent other work from being performed (e.g. our interval function to count the seconds).

// Note: In this example, our long-running loop is intentional, but in the future we'll be careful
// not to unintentionally create blocking behavior like this. Node.js is powerful because of its
// ability to handle many requests concurrently, but it's unable to do that when blocked.
