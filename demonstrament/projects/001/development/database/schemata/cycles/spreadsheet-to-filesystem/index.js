import {
  Schema
} from 'mongoose'
import SpreadsheetToSpreadsheetDatabase from '../../subcycles/spreadsheet-to-spreadsheet-database/index.js'
import SpreadsheetDatabaseToFilesystemDatabase from '../../subcycles/spreadsheet-database-to-filesystem-database/index.js'
import SpreadsheetDatabaseToFilesystemDatabase from '../../subcycles/filesystem-database-to-filesystem/index.js'
const SpreadsheetToFilesystem = new Schema({
  name: String,
  subcycles: [],
}, {}, )
export default SpreadsheetToFilesystem