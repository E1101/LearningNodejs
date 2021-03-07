const fs = require('fs')
// we're using the https module instead of http. This is because Node.js needs
// to handle encryption and other complexities when accessing secure urls.
const https = require('https')

const fileUrl = 'https://www.newline.co/fullstack-react/assets/images/fullstack-react-hero-book.png'

https.get(fileUrl, res => {
  const chunks = []

  // By default, Node.js uses Buffer objects to store and transmit data because it's more efficient.
  // Buffer.concat() can convert an array of Buffer objects into a single Buffer, and (2) fs.writeFile()
  // is happy to accept a Buffer as its argument for what should be written to a file.
  res.on('data', data => chunks.push(data))
     .on('end', () =>
        fs.writeFile('book.png', Buffer.concat(chunks), err => {
         if (err) console.error(err)
        console.log('file saved!')
    })
  )
})
