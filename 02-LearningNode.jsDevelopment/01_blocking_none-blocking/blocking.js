let {getUserSync} = require('./lib/getUserSync');

console.log('user1', getUserSync('1'));
console.log('user2', getUserSync('2'));
console.log('user2', getUserSync('3'));

/*
Output:

Took 971.2483681804626to fetch.
user1 User ID: 1
Took 145.84696701861378to fetch.
user2 User ID: 2
Took 425.8709770490394to fetch.
user2 User ID: 3
 */