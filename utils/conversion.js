// takes a string containing a dollar amount and returns a number
import { formatDistance, subDays } from "date-fns";

export function dollarStringToNumber(dollarString) {
    // Remove dollar signs, commas, and any other non-numeric characters (excluding dots and hyphens for decimals and negatives).
    const cleanedString = dollarString.replace(/[^0-9.-]+/g, "");
    // Convert the cleaned string to a number using parseFloat and return the result.
    return parseFloat(cleanedString);
}

// function to parse the first delivery time from a string and format it as a timestamp
function convertTimeToTimestamp(str, day) {
    // Regular expression to extract the time in hourly format
    const timeRegex = /(\d{1,2})\s*([apm]{2})/;
    const match = str.match(timeRegex);

    if (!match) {
        return null; // No time found in the string
    }

    let [_, hour, period] = match;

    // Convert to 24-hour format
    let hour24 = parseInt(hour, 10);
    if (period === "pm" && hour24 !== 12) {
        hour24 += 12;
    } else if (period === "am" && hour24 === 12) {
        hour24 = 0;
    }

    // Set the date to either today or tomorrow
    const date = new Date();
    if (day === "tomorrow") {
        date.setDate(date.getDate() + 1); // Move to the next day if "tomorrow"
    }

    date.setHours(hour24, 0, 0, 0); // Set the extracted hour, and reset minutes, seconds, and milliseconds to 0

    return date.getTime(); //return the timestamp
}

// Function to extract and parse the first date from a string for the format "MMM DD" ex: "Aug 20".
// returns a timestamp
export function extractTimestamp(str) {
    const lowerCaseStr = str.toLowerCase();
    const isToday = lowerCaseStr.includes("today");
    const isTomorrow = lowerCaseStr.includes("tomorrow" || "overnight");

    // First check if the delivery date is today or tomorrow. If so handle it differently than dates.
    if (isToday || isTomorrow) {
        return convertTimeToTimestamp(
            lowerCaseStr,
            isToday ? "today" : "tomorrow"
        );
    }

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
