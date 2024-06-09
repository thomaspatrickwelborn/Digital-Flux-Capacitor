import {
  Schema
} from 'mongoose'
import WorksheetRange as WorksheetRangeSchema from 'database/schemata/cycles/spreadsheet-to-filesystem/spreadsheet-to-spreadsheet-database/worksheet/range/index.js'
import Worksheet as WorksheetSchema from 'database/schemata/cycles/spreadsheet-to-filesystem/spreadsheet-to-spreadsheet-database/worksheet/index.js'
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