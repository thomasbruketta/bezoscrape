import { CONSTANTS } from "./utils/constants.js";
import {
    dollarStringToNumber,
    extractTimestamp,
    timestampToDateString,
} from "./utils/conversion.js";

// Function to process the page data and return the cheapest, highest rated, and earliest delivery products.
export function processPageData(pageDataArr) {
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
        const deliveryDateTimestamp = extractTimestamp(product.date);

        // construct the full url
        const fullUrl = CONSTANTS.ROOT_URL + product.url;

        if (priceNum < result.cheapest.value) {
            result.cheapest.value = priceNum;
            result.cheapest.url = fullUrl;
        }
        if (ratingNum > result.highestRated.value) {
            result.highestRated.value = ratingNum;
            result.highestRated.url = fullUrl;
        }
        if (deliveryDateTimestamp < result.earliestDelivery.value) {
            result.earliestDelivery.value = deliveryDateTimestamp;
            result.earliestDelivery.url = fullUrl;
        }
    });

    // Convert the timestamp back a human readable date
    result.earliestDelivery.value = timestampToDateString(
        result.earliestDelivery.value
    );

    return result;
}
