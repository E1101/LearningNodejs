/*
In the first chapter we built a chat app. We could open two different browsers,
and anything we typed into one window would appear in the other. We're going to
show that we can do this without a browser.

By making a small tweak to our readline example, we'll be able to open our chat
app in a browser window and send messages to it using our terminal.
 */
const http = require('http')
const readline = require('readline')
const querystring = require('querystring')

const rl = readline.createInterface({ input: process.stdin })

rl.on('line', line =>
  http.get(
      // To ensure that our messages are properly formatted and special characters are escaped,
      // we also use the built-in `querystring` module.
    `http://localhost:1337/chat?${querystring.stringify({ message: line })}`
  )
)
