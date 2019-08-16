let {getUserSync} = require('./lib/getUserSync');

console.log('starting user1');
let user1 = getUserSync('123');
console.log('user1', user1);

console.log('starting user2');
let user2 = getUserSync('321');
console.log('user2', user2);

let sum = 1 + 2;
console.log('The sum is ' + sum);
