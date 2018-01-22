/**
 * Returns a random number from within a range
 * @param {number} min - Minimum number
 * @param {number} max - Maximum number
 * @returns {number} - Randome number between 'min' and 'max'
 */
export const getRandomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min)) + min ;
}