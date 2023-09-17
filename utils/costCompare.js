// Description: This file contains the function to compare the prices of the products and return the cheapest one.
// params: products - array of product objects
function findCheapestProduct(products) {
    productData.reduce((prev, current) =>
        prev.price < current.price ? prev : current
    ).link;
}
