import {
  Schema
} from 'mongoose'
import Worksheet from 'worksheet/index.js'
const SpreadsheetToSpreadsheetDatabase = new Schema({
  spreadsheet: {
    path: String,
    worksheets: {
      type: Map,
      of: WorksheetSchema
    }
  },
  database: {
    uri: String,
    options: {},
  },
}, {})
export default SpreadsheetToSpreadsheetDatabase