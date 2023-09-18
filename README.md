# Bezoscrape: An Amazon Search Page Scraper Script

## Overview

Bezoscrape is a simple script that leverages the power of Puppeteer to scrape data from any Amazon search results page. Once executed, the script examines webpage of the provided URL to identify products. It then outputs the URL of the product with the lowest price, the product with the highest rating, and the product that has the quickest delivery time.

## Getting Started

Follow the steps below to get up and running with Bezoscrape:

1. **Clone the Repository**

```bash
git clone <repository_url>
```

2. **Navigate to the Repository Directory**

```bash
cd <repository_directory>
```

3. **Install the Required NPM Packages**

```bash
npm install
```

4. **Run the Application**

    To scrape data from a specific Amazon search results page, run the following command:

```bash
node bezoscrape.js <amazon_product_search_url>
```

5. **Verify the Output**

    The script will output the URL of the product with the lowest price, the product with the highest rating, and the product that has the quickest delivery time. IMPORTANT, the script runs a logged out session of Amazon. When validating results, be sure to use a logged out version of Amazon to ensure the results are accurate as Prime members get expedited shipping on many products.

## TODO:

-   [ ] Add unit tests.
-   [ ] Refactor and split large methods into smaller, testable ones.
-   [ ] Address the edge case bug concerning shipping dates set in a future year.
-   [ ] Introduce more informative error handling.
-   [ ] Add support for signed in Amazon experience.
