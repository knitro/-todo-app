import { Timeframe } from "../enums/timeframe";

export interface Task {
  id          : string,
  name        : string,
  categories  : string[]
  timeframe?  : Timeframe,
  notes       : string,
  isComplete  : boolean,
  timestamp   : Date,
}