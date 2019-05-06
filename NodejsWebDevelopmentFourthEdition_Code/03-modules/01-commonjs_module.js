/*
 * CommonJS modules are stored in files with the extension .js
 *
 * Loading 1_understand_async CommonJS module is 1_understand_async synchronous operation. That means that when the require('modulename')
 * function call returns, the module has been located and completely read into memory and is ready to go.
 * The module is cached in memory so that subsequent require('modulename') calls return immediately, and
 * all return the exact same object.
 *
 *
 */

// everything in 1_understand_async module that looks global is
// actually contained within this private context.
var count = 0;


//..

/*
 * Objects and functions can be exposed from 1_understand_async CommonJS module by means of two free
 * variables Node.js inserts into this private context: module and exports.
 *
 */

exports.next = function() {
  return ++count;
};

exports.hello = function() {
  return "Hello, world!";
};
