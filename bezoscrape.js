import { format } from "date-fns";
import { getPageData } from "./getPageData.js";

import {
    dollarStringToNumber,
    extractDateTimestamp,
} from "./utils/conversion.js";

// create an async try catch block to handle errors
async function scrape() {
    try {
        // call getPageData function
        await getPageData(
            "https://www.amazon.com/s?k=headphones&crid=VS7GDL0WY0ZR&sprefix=headphones%2Caps%2C522&ref=nb_sb_noss_2"
        ).then((pageDataArr) => {
            let result = {
                cheapest: { value: Infinity, url: "" },
                highestRated: { value: -Infinity, url: "" },
                earliestDelivery: { value: Infinity, url: "" },
            };

            // Go through each product and compare it to the current cheapest, highest rated, and earliest delivery products.
            pageDataArr.forEach((product) => {
                // Convert the price string to a number
                const priceNum = dollarStringToNumber(product.price);

                // Convert the rating string to a number, parse float will ignore the trailing " out of 5 stars".
                const ratingNum = parseFloat(product.rating);

                // Convert the delivery date string to timestamp
                const deliveryDateTimestamp = extractDateTimestamp(
                    product.date
                );

                if (priceNum < result.cheapest.value) {
                    result.cheapest.value = priceNum;
                    result.cheapest.url = product.url;
                }
                if (ratingNum > result.highestRated.value) {
                    result.highestRated.value = ratingNum;
                    result.highestRated.url = product.url;
                }
                if (deliveryDateTimestamp < result.earliestDelivery.value) {
                    result.earliestDelivery.value = deliveryDateTimestamp;
                    result.earliestDelivery.url = product.url;
                }
            });

            // convert the earliest delivery timestamp back to a date string for validation
            result.earliestDelivery.value = format(
                result.earliestDelivery.value,
                "MMMM d, yyyy"
            );

            console.log(result);
        });
    } catch (e) {
        console.log("Encountered and error:", e);
    }
}

scrape();
