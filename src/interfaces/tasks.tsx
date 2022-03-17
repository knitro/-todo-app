import { Categories } from "../enums/categories";
import { Colours } from "../enums/colours";

export interface Task {
  id        : string,
  name      : string,
  category  : Categories,
  colour    : Colours,
  notes     : string,
}