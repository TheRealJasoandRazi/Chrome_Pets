const puppeteer = require('puppeteer');

const EXTENSION_PATH = 'src/'; //path to source code
const EXTENSION_ID = 'ghpfjapaelnglniiiefgahcpdaioilcl';

let browser; //references browser instance

beforeEach(async () => {
  console.log(`Launching Puppeteer with extension from: ${EXTENSION_PATH}`);

  browser = await puppeteer.launch({
    headless: false, //causes browser to be visible when running tests, can be set to new
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`
    ]
  });
  console.log('Puppeteer launched successfully');
});
  
afterEach(async () => {
  await browser.close();
  browser = undefined; 
}); //this isolates tests, one test can impact the result of another if in the same browser

test('popup renders correctly', async () => {
  const page = await browser.newPage();
  await page.goto(`chrome-extension://${EXTENSION_ID}/Home_PopUp.html`);
  
  await page.waitForSelector('h1') //waits for DOM content to load
  
  const title = await page.$('h1');
  const titleText = await page.evaluate(title => title.textContent, title);
  
  expect(titleText).toBe("Chrome Pets");
});