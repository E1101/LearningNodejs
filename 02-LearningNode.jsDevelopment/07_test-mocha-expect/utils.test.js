const utils  = require('./utils');
const expect = require('expect');

it('should add two numbers', () => {
  let res = utils.add(33, 11);
  expect(res).toBe(44).toBeA('number');
});

it('should square number', () => {
  let res = utils.square(3);
  expect(res).toBe(9).toBeA('number');
});

it('should set firstName and lastName', () => {
  let user = {location: 'Philadelphia', age: 25};
  let res  = utils.setName(user, 'Andrew Mead');
  expect(res).toInclude({
    firstName: 'Andrew',
    lastName: 'Mead'
  })
});

it('should async add two numbers', (done) => {
  utils.asyncAdd(4, 3, (sum) => {
    expect(sum).toBe(7).toBeA('number');
    done();
  });
});

it('should async square number', (done) => {
  utils.asyncSquare(5, (res) => {
    expect(res).toBe(25).toBeA('number');
    done();
  });
});

it('should expect some values', () => {
  expect("12").toNotBe(12);
  expect({name: 'andrew'}).toNotEqual({name: 'Andrew'});
  expect([2,3,4]).toExclude(1);
  expect({
    name: 'Andrew',
    age: 25,
    location: 'Philadelphia'
  }).toInclude({
    age: 25
  })
});
