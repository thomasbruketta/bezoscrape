import { format } from "date-fns";
import { getPageData } from "./getPageData.js";
import { processPageData } from "./processPageData.js";

// create an async try catch block to handle errors
async function scrape() {
    try {
        // call getPageData function
        await getPageData(
            "https://www.amazon.com/s?k=headphones&crid=VS7GDL0WY0ZR&sprefix=headphones%2Caps%2C522&ref=nb_sb_noss_2"
        ).then((pageDataArr) => {
            const result = processPageData(pageDataArr);

            // convert the earliest delivery timestamp back to a date string for validation
            // result.earliestDelivery.value = format(
            //     result.earliestDelivery.value,
            //     "MMMM d, yyyy"
            // );

            console.log(result);
        });
    } catch (e) {
        console.log("Encountered and error:", e);
    }
}

scrape();
