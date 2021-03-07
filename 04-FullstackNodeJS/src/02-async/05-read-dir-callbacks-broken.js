const fs = require('fs')

fs.readdir('./', (err, files) => {
  if (err) return console.error(err)

  files.forEach(function (file) {
    fs.readFile(file, (err, fileData) => {
      if (err) return console.error(err)

      console.log(`${file}: ${fileData.length}`)
    })
  })

  console.log('done!')
})

/*
done!
01-passport-set-timeout.js: 161
02-configuration_management-creating_an_auth_module-validation-modulize-set-timeout-sync.js: 242
04-adding_users-product_filtering-read-dir-callback.js: 166
05-user_authorization-fetching_a_single_product-read-dir-callbacks-broken.js: 306
04-adding_users-product_filtering-read-file-sync.js: 191
03-health_check-session_sharing-persistence_with_JWTs-relationships-reading_query_parameters-read-file-callback.js: 204
03-health_check-session_sharing-persistence_with_JWTs-relationships-reading_query_parameters-read-file-callback-error.js: 197
 */
