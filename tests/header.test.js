/**
 * Define a new function
 * the first argument is the description of the test
 * the second argument is a function that is called for testing
 */
test('Adds two numbers', () => {
  const sum = 1 + 2;
  expect(sum).toEqual(3);
});