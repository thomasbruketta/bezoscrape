const puppeteer = require("puppeteer");
const { formatDistance, subDays } = require("date-fns");

async function getPageData(url) {
    // TODO: SET TO HEADLESS
    // setup puppeteer
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // go to page
    await page.goto(url);

    // wait for search results to load
    await page.waitForSelector(".s-result-list .s-result-item");

    // gather results from page
    const results = await page.evaluate(() => {
        // create a function to extract relevant product detail. This needs to be within the evaluate function so that it has access to the DOM.
        function extractProductDetails(product) {
            const priceEl = product.querySelector(".a-price .a-offscreen");
            const ratingEl = product.querySelector("i.a-icon > .a-icon-alt");
            // use the aria-label to find delivery as the other selectors were less stable between various products.
            const deliveryEl = product.querySelector(
                `[aria-label*="delivery"]`
            );

            function dollarStringToNumber(dollarString) {
                // Remove dollar signs, commas, and any other non-numeric characters (excluding dots and hyphens for decimals and negatives).
                const cleanedString = dollarString.replace(/[^0-9.-]+/g, "");
                // Convert the cleaned string to a number using parseFloat and return the result.
                return parseFloat(cleanedString);
            }

            // To get month number from month string, the year 1984 is used as a random reference year.
            function getMonthNumber(monthString) {
                return new Date(`${monthString} 1, 1984`).getMonth();
            }

            function getDatesFromDeliveryEl(deliveryEl) {
                // Regular expression to capture month followed by 1 or 2 digit day
                const regex =
                    /(\bJan\b|\bFeb\b|\bMar\b|\bApr\b|\bMay\b|\bJun\b|\bJul\b|\bAug\b|\bSep\b|\bOct\b|\bNov\b|\bDec\b) (\d{1,2})/g;

                const datesArr = [];

                let match;

                // Keep extracting dates while there's a match
                while (
                    (match = regex.exec(
                        deliveryEl.getAttribute("aria-label")
                    )) !== null
                ) {
                    datesArr.push(match[0]); // The full matched string (e.g., "Oct 2")
                }
                return datesArr;
            }

            function getEarliestDateFromArray(datesArr) {
                const currentYear = new Date().getFullYear();

                // Convert date strings into timestamps
                const timestamps = datesArr.map((dateStr) => {
                    const [monthStr, day] = dateStr.split(" ");
                    const monthNumber = new Date(
                        `${monthStr} 1, ${currentYear}`
                    ).getMonth();
                    return new Date(
                        currentYear,
                        monthNumber,
                        parseInt(day, 10)
                    ).getTime();
                });

                // Find the minimum timestamp (earliest date)
                const earliestTimestamp = Math.min(...timestamps);

                // TODO: use date-fns to help here.
                return formatToDate(new Date(earliestTimestamp));
            }

            if (!priceEl || !ratingEl) {
                return null;
            }

            const productDetails = {
                price: dollarStringToNumber(priceEl.innerText),
                rating: parseFloat(ratingEl.innerText.split(" ")[0]), // get the first number from the rating string
                date: getEarliestDateFromArray(
                    getDatesFromDeliveryEl(deliveryEl)
                ),
            };

            console.log(productDetails);

            return productDetails;
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
    //   await browser.close();
}

// create an async try catch block to handle errors
async function scrape() {
    try {
        // call getPageData function
        await getPageData(
            "https://www.amazon.com/s?k=headphones&crid=VS7GDL0WY0ZR&sprefix=headphones%2Caps%2C522&ref=nb_sb_noss_2"
        );
    } catch (e) {
        console.log("Encountered and error:", e);
    }
}

scrape();
