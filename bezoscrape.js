import puppeteer from "puppeteer";

async function getPageData(url) {
  // TODO: SET TO HEADLESS
  // setup puppeteer
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // go to page
  await page.goto(url);

  // gather results from page
  const results = await page.evaluate(() => {
    // create a function to extract relevant product detail. This needs to be within the evaluate function so that it has access to the DOM.
    function extractProductDetails(product) {
      console.log(product);
    }

    // create an array of products. Note that these selectors could change and may need to be updated.
    const productsArr = Array.from(
      document.querySelectorAll(".s-result-list .s-result-item")
    );

    // call method to extract relevant pruduct details.
    const productDataArr = productsArr.map((product) =>
      extractProductDetails(product)
    );
  });

  // close the browser
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
