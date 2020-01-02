function soma(a, b) {
  return a + b;
}

test('if I call soma function 4 and 5 it should return 9', () => {
  const result = soma(4, 5);

  expect(result).toBe(9);
});

// import Registration from '../src/app/controllers/RegistrationsController';

// test('it should get all Registrations', () => {

// });
