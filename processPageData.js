import {
    dollarStringToNumber,
    extractDateTimestamp,
} from "./utils/conversion.js";

// Function to process the page data and return the cheapest, highest rated, and earliest delivery products.
export function processPageData(pageDataArr) {
    let processedPageData = {
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
        const deliveryDateTimestamp = extractDateTimestamp(product.date);

        if (priceNum < processedPageData.cheapest.value) {
            processedPageData.cheapest.value = priceNum;
            processedPageData.cheapest.url = product.url;
        }
        if (ratingNum > processedPageData.highestRated.value) {
            processedPageData.highestRated.value = ratingNum;
            processedPageData.highestRated.url = product.url;
        }
        if (deliveryDateTimestamp < processedPageData.earliestDelivery.value) {
            processedPageData.earliestDelivery.value = deliveryDateTimestamp;
            processedPageData.earliestDelivery.url = product.url;
        }
    });

    return processedPageData;
}
