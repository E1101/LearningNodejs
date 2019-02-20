/*
 * ES6 modules are referred to by Node.js with the extension .mjs
 *
 * ES6 modules stand to be a big improvement for the entire JavaScript world,
 * by getting everyone on the same page with a common module format and mechanisms.
 *
 * ES6 modules load asynchronously.
 */

let count = 0;

function squared()
{
    return Math.pow(count, 2);
}


//..

/*
 * ES6 items exported from a module are declared with the export keyword.
 * This keyword can be put in front of any top-level declaration, such as
 * variable, function, or class declarations:
 */

export const meaning = 42;

export let nocount = -1;

export
{
  squared
};


export function next()
{
  return ++count;
}

export function hello()
{
  return "Hello, world!";
}

// Using export default can be done once per module, and is the default export from the module.
// The default export is what code outside the module accesses when using the module object itself.
export default function()
{
  return count;
}
