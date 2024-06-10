import {
  Schema
} from 'mongoose'
import Cycle from '../../project/cycle/index.js'
import SpreadsheetToSpreadsheetDatabase from '../../subcycles/spreadsheet-to-spreadsheet-database/index.js'
import SpreadsheetDatabaseToFilesystemDatabase from '../../subcycles/spreadsheet-database-to-filesystem-database/index.js'
const SpreadsheetToFilesystem = new Schema({
  name: String,
  subcycles: [],
}, {}, )