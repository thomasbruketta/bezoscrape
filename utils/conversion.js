// takes a string containing a dollar amount and returns a number
export function dollarStringToNumber(dollarString) {
    // Remove dollar signs, commas, and any other non-numeric characters (excluding dots and hyphens for decimals and negatives).
    const cleanedString = dollarString.replace(/[^0-9.-]+/g, "");
    // Convert the cleaned string to a number using parseFloat and return the result.
    return parseFloat(cleanedString);
}
