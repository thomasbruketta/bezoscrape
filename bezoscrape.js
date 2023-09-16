import puppeteer from "puppeteer";

async function getPageData(url) {
  // TODO: SET TO HEADLESS
  // setup puppeteer
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // go to page
  await page.goto(url);

  await browser.close();
}

// create an async try catch block to handle errors
async function scrape() {
  try {
    // call getPageData function
    await getPageData(
      "https://www.amazon.com/s?k=headphones&crid=VS7GDL0WY0ZR&sprefix=headphones%2Caps%2C522&ref=nb_sb_noss_2"
    );
  } catch (e) {
    console.log("our error", e);
  }
}

scrape();
