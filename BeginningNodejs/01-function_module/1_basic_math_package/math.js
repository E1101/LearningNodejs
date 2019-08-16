const _ = require('lodash');

function add(a, b)
{
  return a + b;
}

// we can in replacement use sum(...num) to have
// array [0, 1, 2, 3] as arguments.
function sum()
{
  let numbers = Array.from(arguments); // arguments: { '0': 10, '1': 5, '2': 6 }

  let sum = 0;
  numbers.forEach(num => sum += num);
  return sum;
}

/**
 * If the argument is single array, sum up the numbers,
 * and if it's more than one array, first combine the arrays
 * into one before summing up.
 *
 * @returns {number}
 */
function sumArray()
{
  let arr = arguments[0];

  if (arguments.length > 1)
    // arguments in form of: [10, 5], [5, 6]
    // will change to [10, 5, 5, 6]
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

/*
#function #(spread operator) #(concat array) #array
*/