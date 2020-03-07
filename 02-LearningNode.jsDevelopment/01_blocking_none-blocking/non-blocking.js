let {getUser} = require('./lib/getUser');

getUser('1', function (err, user) {
  console.log('user1', user);
});

getUser('2', function (err, user) {
  console.log('user2', user);
});

getUser('3', function (err, user) {
  console.log('user3', user);
});

/*
Output:

Took 264.58034537063895to fetch.
Took 247.39800131492237to fetch.
Took 497.80501308463937to fetch.
user2 User ID: 2
user1 User ID: 1
user3 User ID: 3
 */
