import puppeteer from "puppeteer";

export async function getPageData(url) {
    // TODO: SET TO HEADLESS
    // setup puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // go to page
    await page.goto(url);

    // wait for search results to load
    await page.waitForSelector(".s-result-list .s-result-item");

    // gather results from page
    // data format is [ {price: string, rating: string, date: string}, ...]
    const productDetailsArr = await page.evaluate(() => {
        // create a function to extract relevant product detail. This needs to be within the evaluate function so that it has access to the DOM.
        function extractProductDetails(product) {
            const priceEl = product.querySelector(".a-price .a-offscreen");
            const ratingEl = product.querySelector("i.a-icon > .a-icon-alt");
            // use the aria-label to find delivery as the other selectors were less stable between various products.
            const deliveryEl = product.querySelector(
                `[aria-label*="delivery"]`
            );
            const linkEl = product.querySelector("a.a-link-normal");

            if (!priceEl || !ratingEl || !deliveryEl || !linkEl) {
                return null;
            }

            const productDetails = {
                price: priceEl.innerText,
                rating: ratingEl.innerText,
                date: deliveryEl.getAttribute("aria-label"),
                url: linkEl.getAttribute("href"),
            };

            return productDetails;
        }

        // create an array of products. Note that these selectors could change and may need to be updated.
        const productsElArr = Array.from(
            document.querySelectorAll(".s-result-list .s-result-item")
        );

        // call method to extract relevant pruduct details.
        const productStringDetailArr = productsElArr.map((product) =>
            extractProductDetails(product)
        );

        // filter out any null values
        const cleanedProductStringDetailArr = productStringDetailArr.filter(
            (product) => product !== null
        );

        return cleanedProductStringDetailArr;
    });

    // close the browser
    await browser.close();

    // return array of products, all values are strings.
    return productDetailsArr;
}
