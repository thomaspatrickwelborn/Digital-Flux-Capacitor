import {
  Schema
} from "mongoose"
const SpreadsheetToSpreadsheetDatabase = new Schema({
  spreadsheet: {
    path: String,
    worksheets: {},
  },
  database: {
    uri: String,
    options: {},
  },
}, {})