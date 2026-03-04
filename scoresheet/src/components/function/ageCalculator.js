/**
 * Calculates the age in years based on a given birth date string.
 * Assumes the birthDateString is in a valid format that the Date constructor can parse (e.g., "YYYY-MM-DD" or "MM/DD/YYYY").
 * 
 * @param {string} birthDateString The date of birth.
 * @returns {number} The age in full years.
 */
export function calculateAge(birthDateString) {
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    // If the current month is less than the birth month, or if it's the same month but the current day is less than the birth day,
    // then the birthday hasn't occurred this year, so subtract 1 from the age.
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    return age;
}