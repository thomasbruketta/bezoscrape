#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { getPageData } from "./getPageData.js";
import { processPageData } from "./processPageData.js";

const argv = yargs(hideBin(process.argv))
    .option("u", {
        alias: "url",
        describe: "Amazon product search URL",
        demandOption:
            "You must provide a valid Amazon product search URL using the -u or --url option.",
        type: "string",
    })
    .example(
        "$0 -u https://www.amazon.com/s?k=laptop",
        "Scrape Amazon search results for laptops."
    )
    .help()
    .alias("h", "help")
    .fail((msg, err, yargs) => {
        if (err) throw err; // Preserve stack
        console.error("Error:", msg);
        console.error("Run with --help for usage information.");
        process.exit(1);
    }).argv;

const amazonUrl = argv.url;

// create an async try catch block to handle errors
async function scrape() {
    try {
        // call getPageData function
        await getPageData(amazonUrl).then((pageDataArr) => {
            const result = processPageData(pageDataArr);

            console.log(result);
        });
    } catch (e) {
        console.log("Encountered and error:", e);
    }
}

scrape();
