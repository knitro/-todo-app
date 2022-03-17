/**
 * Capitalises the First Letter
 * @param input - the string to capitalise
 */
export function capitaliseFirstLetter(input : string) : string {
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

/**
 * Converts a Snake Case String into "English"
 * Note that the starting letter of each word will be capitalised 
 * @param input - the string to converted to "English"
 */
 export function convertSnakeToEnglish(input : string) : string {
  let splitStringArray : string[] = input.toLowerCase().split("_");
  let adjustedStringArray = splitStringArray.map((current : string) => {
    // RE-ENABLE IF WANT TO MAKE FUNCTION MORE ROBUST
    // if (current == ("or" || "and")) { 
    //   return current.toLowerCase()
    // }
    return capitaliseFirstLetter(current)
  })
  return adjustedStringArray.join(" "); 
}

/**
 * Converts a boolean into a Yes/No string
 * @param input - the 
 */
export function convertBooleanToString(input : boolean) : string {
  return (input) ? "Yes" : "No";
}

export function generateTimeFrame(start : number, end : number) : string {
  const returnString = convert24HourToString(start) + " - " + convert24HourToString(end);
  return returnString;
}

export function convert24HourToString(time : number) : string {

  if ((time < 0) || (time >= 2400)) {
    console.log("Time should be from [0-2400]")
    return "Invalid Time"
  } else {
    const timeAsString : string = time.toFixed(0); //Remove decimal points
    let hours : string    = (timeAsString.length === 4) 
                          ? (timeAsString.slice(0,2)) 
                          : ((timeAsString.length === 3) ? (timeAsString.charAt(0)) : "0");
    let minutes : string  = (timeAsString.length === 4) 
                          ? timeAsString.slice(2) 
                          : ((timeAsString.length === 3) ? (timeAsString.slice(1)) : timeAsString)
    let isAm : boolean = true;

    //Convert back to 12 hour time
    if (parseInt(hours) > 12) {
      isAm = false;
      hours = (parseInt(hours) - 12).toFixed(0);
    }
    
    //EDGE CASE: Check if hours is 0 (12am)
    if (hours === "0") {
      isAm = true;
      hours = "12";
    }

    //Ensure Hours has 0 placed correctly
    if (parseInt(hours) < 10) {
      hours = "0" + hours;
    }

    //Check if Minutes are valid
    if (parseInt(minutes) > 59) {
      console.log("Time should be from [0-2400]")
      return "Invalid Time"
    }

    //Ensure Minutes has 0 placed correctly
    if (parseInt(minutes) < 10) {
      minutes = "0" + parseInt(minutes).toString();
    }

    const returnString = hours + ":" + minutes + ((isAm) ? "am" : "pm");
    return returnString;
  }
}

/**
 * Converts Validity Times and Dates into a single coherent string.
 * @param fromDate - The starting date (only D/M/Y is considered here)
 * @param toDate - The ending date (only D/M/Y is considered here)
 * @param fromTime - The starting time (0-2399, or undefined if field is not applicable)
 * @param toTime - The ending time (0-2399, or undefined if field is not applicable)
 */
export function convertValidityToString(
  fromDate : Date | undefined, toDate : Date | undefined, 
  fromTime : number | undefined, toTime : number | undefined) : string 
{
  //Initialisation
  let returnString : string = "";
  
  //Add Dates if Appropriate
  if (fromDate) {
    returnString += " from " + fromDate.toDateString();
  }
  if (toDate) {
    returnString += (fromDate) ? " - " : " until";
    returnString += toDate.toDateString();
  }

  //Add Separator between Dates and Times if Needed
  if ((fromDate || toDate) && (fromTime || toTime)) {
    returnString += "\n";
  }

  //Add Times if Appropriate
  if (fromTime) {
    returnString += convert24HourToString(fromTime);
  }
  if (toTime) {
    returnString += (fromTime) ? " - " : " until ";
    returnString += convert24HourToString(toTime);
  }

  //Trim and Return
  returnString = returnString.trim();
  return returnString;
}