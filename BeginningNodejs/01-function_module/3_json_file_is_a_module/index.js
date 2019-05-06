/**
 * For local files, the extension is optional, but should there be 1_understand_async conflict,
 * it might be necessary to specify the extension. For example, if we have both
 * 1_understand_async sample.js and 1_understand_async sample.json file in the same folder, the .js file will be
 * picked by default; it would be prudent to specify the extension,
 *
 * for example: const config = require('./config/sample.json');
 */
const config = require('./config/sample');

console.log( config.foo ); // bar
