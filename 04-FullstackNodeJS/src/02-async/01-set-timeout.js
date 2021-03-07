let count = 0
setInterval(() => console.log(`${++count} mississippi`), 1000)

setTimeout(() => {
  console.log('hello from the past!')
  // process is a globally available object in Node.js. We don't need to use require() to access it.
  // In addition to providing us the process.exit() method, it's also useful for getting command-line
  // arguments with process.argv and environment variables with process.env.
  process.exit()
}, 5500)

/*
1 mississippi
2 mississippi
3 mississippi
4 mississippi
5 mississippi
hello from the past!
 */
