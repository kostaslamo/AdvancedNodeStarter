const puppeteer = require('puppeteer');

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
test('We can launch a browser', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);
  expect(text).toEqual('Blogster');
});