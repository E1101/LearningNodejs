/*
 * This is how the code executes:
 * $ node --experimental-modules simpledemo.mjs
 *
 */
import * as mymodule from './02-es6_module.mjs';

console.log( mymodule.hello() );
console.log( `${mymodule.next()} ${mymodule.squared()}` );
console.log( `${mymodule.next()} ${mymodule.squared()}` );
console.log( `${mymodule.default()} ${mymodule.squared()}` );
console.log( `${mymodule.next()} ${mymodule.squared()}` );
console.log( `${mymodule.next()} ${mymodule.squared()}` );
console.log( `${mymodule.next()} ${mymodule.squared()}` );
console.log( mymodule.meaning );
