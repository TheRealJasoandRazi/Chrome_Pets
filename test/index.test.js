const puppeteer = require('puppeteer');

const EXTENSION_PATH = 'src/'; //path to source code
const EXTENSION_ID = 'ghpfjapaelnglniiiefgahcpdaioilcl';

let browser; //references browser instance

beforeEach(async () => { //jest code helps structure the tests with puppeteer
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
  
afterEach(async () => { //jest code
  await browser.close();
  browser = undefined; 
}); //this isolates tests, one test can impact the result of another if in the same browser

test('popup renders correctly', async () => { //jest code
  const page = await browser.newPage();
  await page.goto(`chrome-extension://${EXTENSION_ID}/Home_PopUp.html`);
  
  await page.waitForSelector('h1') //waits for DOM content to load
  const title = await page.$('h1');
  const titleText = await page.evaluate(title => title.textContent, title);
  expect(titleText).toBe("Chrome Pets");

  const create_button = await page.$('#Create_Pet_Button'); //puppeteer code
  const delete_button = await page.$('#Delete_Pet_Button'); //puppeteer code
  expect(create_button).toBeTruthy(); //Jest code
  expect(delete_button).toBeTruthy(); //Jest code
});

test('pet is created', async () => {
  const page = await browser.newPage();
  await page.goto(`chrome-extension://${EXTENSION_ID}/Home_PopUp.html`);
  await page.waitForSelector('#Create_Pet_Button');

  const test_page = await browser.newPage();

  await page.click('#Create_Pet_Button');

  await test_page.goto('https://www.google.com/');
  
  const pet = await test_page.waitForSelector('#pet')
  expect(pet).toBeTruthy();
});