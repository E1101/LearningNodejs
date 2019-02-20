const _ = require('lodash');

function add(a, b)
{
  return a + b;
}

function sum()
{
  let numbers = Array.from(arguments);

  let sum = 0;
  numbers.forEach(num => sum += num);
  return sum;
}

/**
 * If the argument is a single array, sum up the numbers,
 * and if it's more than one array, first combine the arrays
 * into one before summing up.
 *
 * @returns {number}
 */
function sumArray()
{
  let arr = arguments[0];

  if (arguments.length > 1)
    arr = _.concat(...arguments);

  // reusing the sum function
  // using the spread operator (...) since
  // sum takes an argument of numbers
  return sum(...arr);
}

module.exports = {
  add,
  sum,
  sumArray,
};
