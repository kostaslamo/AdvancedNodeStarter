const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');
let browser, page;

// Runs before each test ends
beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false
  });
  page = await browser.newPage();
  await page.goto('localhost:3000');
});

// Runs after each test ends
afterEach(async () => {
  await browser.close();
});

/**
 * Define a new function
 * the first argument is the description of the test
 * the second argument is a function that is called for testing
 */
test('Header has the correct text', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);
  expect(text).toEqual('Blogster');
});

test('Clicking login starts auth flow', async () => {
  await page.click('.right a');
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/)
});

test('When signed in, shows logout button', async () => {
  const user = await userFactory();
  const { session, sig } = sessionFactory(user);
  await page.setCookie({ name: 'session', value: session });
  await page.setCookie({ name: 'session.sig', value: sig });
  await page.goto('localhost:3000');
  await page.waitFor('ul.right li:nth-child(2) a');
  const logoutButton = await page.$eval('ul.right li:nth-child(2) a', el => el.innerHTML);
  expect(logoutButton).toEqual('Logout')
});