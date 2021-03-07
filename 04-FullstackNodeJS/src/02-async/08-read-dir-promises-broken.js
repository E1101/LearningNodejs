const fs = require('fs').promises

fs.readdir('./')
  .catch(err => console.error(err))
  .then(files => {
    files.forEach(function (file) {
      // our use of the fs.readFile() promise is non-blocking.
      // This means that we're going to see done! printed to the terminal
      // before any of the results, and we're going get the results out of order.
      fs.readFile(file)
        .catch(err => console.error(err))
        .then(data => console.log(`${file}: ${data.length}`))
    })

    console.log('done!')
  })
