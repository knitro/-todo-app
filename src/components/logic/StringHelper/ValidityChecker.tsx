/**
 * Determines if the string supplied as the parameter is a valid email string or not
 * @param input - the string to check if it is a valid email or not
 * @returns true if the string is a valid email address, otherwise fakse
 */
export const isValidEmail = (input : string) : boolean => {
  // Regex expects the format of @ + [any number of characters] + . + [any number of characters]
  const regex = /@[A-Za-z0-9]+\.[A-Za-z0-9]+/
  const output = input.match(regex)
  // console.log("isValidEmail | Output from Regex: ", output)
  if (output != null) {
    return true
  }
  return false 
}