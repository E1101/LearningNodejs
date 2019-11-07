const util = require('util');

function add(a, b)
{
  return a + b;
}

function sum()
{
  // arguments is an Array-like object accessible inside functions
  // that contains the values of the arguments passed to that function.
  // exp. {'0': 10, '1': 5, '2': 6}

  // here we transform that object into array, the result is:
  // [10, 5, 6]
  // because as i mentioned the arguments is Array-like it means that it
  // does'nt contains .forEach() or map()
  let numbers = Array.from(arguments);

  let sum = 0;
  numbers.forEach(num => {
    if ('number' != typeof num)
      throw Error(util.format('Argument Should Be number; given (%s)%s.', typeof num, num));

    sum += num
  });

  return sum;
}

// testing
console.log( add(10, 6) );    // 16
console.log( sum(10, 4.5, 6) );     // 20.5
