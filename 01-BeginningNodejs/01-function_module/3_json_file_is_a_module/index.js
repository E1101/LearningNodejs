/**
 * For local files, the extension is optional, but should there be conflict,
 * it might be necessary to specify the extension. For example, if we have both
 * sample.js and sample.json file in the same folder, the .js file will be
 * picked by default; it would be prudent to specify the extension,
 *
 * for example: const config = require('./config/sample.json');
 */
const config = require('./config/sample');

console.log( config.foo ); // bar
