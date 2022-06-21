/**
 * Gets the categories and the adjusted name from an input.
 * Splits up the name into categories denoted by semicolons 
 * eg text1: text2: text3 ==> name = text3, categories = [text1, text2] 
 * @returns JS Object with name : string, categories : string[]
 */
export const getCategories : (value : string) => { name : string, categories : string[]} = (value : string) => {

  const substrings : string[]= value.split(":")
  
  let nameFinal = ""
  let categoriesFinal : string[] = []
  const length : number = substrings.length
  substrings.forEach((value : string, index : number) => {
    if (index+1 >= length) {
      nameFinal = value.trim()
    } else {
      categoriesFinal.push(value.trim())
    }
  })

  return {
    name: nameFinal,
    categories: categoriesFinal
  }
}