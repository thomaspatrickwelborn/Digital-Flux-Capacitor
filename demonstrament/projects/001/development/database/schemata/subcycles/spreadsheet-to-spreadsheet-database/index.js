import {
  Schema
} from 'mongoose'
import WorksheetRange as WorksheetRangeSchema from '../worksheet/range/index.js'
import Worksheet as WorksheetSchema from '../worksheet/index.js'
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