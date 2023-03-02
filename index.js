const puppeteer = require('puppeteer');
const fs = require('fs');
const { exec } = require('child_process');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  let images = [];

  page.on('response', async (response) => {
    const url = response.url();

    const isImage = () => {
      return url.match(/.*\.(jpg|png)$/g)?.at(-1);
    };

    // do your image filtering here

    isImage(url) && images.push(url);
  });

  let pageUrl = new URL(process.argv[2]);
  // do url manipulations here
  pageUrl = pageUrl.href;

  await page.goto(pageUrl, {
    waitUntil: 'networkidle0',
  });

  fs.writeFileSync('images.txt', images.join('\n'));

  await browser.close();

  exec('wget -i images.txt');
})();
