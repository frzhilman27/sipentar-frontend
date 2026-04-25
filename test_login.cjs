const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  console.log('Navigating...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });

  console.log('Selecting Admin...');
  const adminBtn = await page.$('button[type="button"]'); // Try finding Portal Admin button
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Portal Admin')) {
      await btn.click();
      break;
    }
  }

  console.log('Typing credentials...');
  await page.type('input[type="email"]', 'admin@sipentar.com');
  await page.type('input[type="password"]', 'password123'); // Assuming some password or triggers error
  
  const submitBtn = await page.$('button[type="submit"]');
  console.log('Clicking login...');
  await submitBtn.click();

  await page.waitForTimeout(3000); // give it time to crash or redirect
  console.log('Final URL:', page.url());

  await browser.close();
})();
