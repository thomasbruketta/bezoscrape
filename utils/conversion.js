// takes a string containing a dollar amount and returns a number
import { formatDistance, subDays } from "date-fns";

export function dollarStringToNumber(dollarString) {
    // Remove dollar signs, commas, and any other non-numeric characters (excluding dots and hyphens for decimals and negatives).
    const cleanedString = dollarString.replace(/[^0-9.-]+/g, "");
    // Convert the cleaned string to a number using parseFloat and return the result.
    return parseFloat(cleanedString);
}

// Function to extract and parse the first date from a string for the formate "MMM DD" ex: "Aug 20".
export function extractTimestamp(str) {
    // First check if the delivery date is today or tomorrow.
    // TODO

    //If localizing in the future, this array should not be hardcoded. Instead, it should be generated from the locale.
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const monthPattern = months.join("|");
    // Create a regex to match the month and day from the string.
    const regex = new RegExp(`(${monthPattern}) (\\d{1,2})`);

    const match = regex.exec(str);

    if (!match) return null;

    const monthNumber = months.indexOf(match[1]);
    const dayNumber = parseInt(match[2], 10);
    // TODO:  Account for when delivery dates are in the next calendar year. Currently it assume current year. (Ex, is is Dec 20, 2023 and the delivery date is Jan 2, 2024, it will return Jan 2, 2023)
    const currentYear = new Date().getFullYear();

    const dateObj = new Date(currentYear, monthNumber, dayNumber);

    return dateObj.getTime(); // return the timestamp
}
