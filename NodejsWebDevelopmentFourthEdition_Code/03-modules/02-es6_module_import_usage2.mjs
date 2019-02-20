/*
 * Each imported object is its own thing rather than being attached to another object.
 * Instead of writing simple2.next(), you simply write next(). The as clause is a way
 * to declare an alias, if nothing else so you can use the default export.
 *
 */
import {
    default as simple, hello, next
} from './02-es6_module';

console.log( hello() );
console.log( next() );
console.log( next() );
console.log( simple() );
console.log( next() );
console.log( next() );
console.log( next() );
