import SpreadsheetToSpreadsheetDatabase from './spreadsheet-to-spreadsheet-database/index.js'
import SpreadsheetDatabaseToFilesystemDatabase from './spreadsheet-database-to-filesystem-database/index.js'
import FilesystemDatabaseToFilesystem from './filesystem-database-to-filesystem/index.js'
import Cycle from '#core/cycle/index.js'
const Subcycles = {
  SpreadsheetToSpreadsheetDatabase,
  SpreadsheetDatabaseToFilesystemDatabase,
  FilesystemDatabaseToFilesystem,
}
export default class SpreadsheetToFilesystem extends Cycle {
  constructor($settings = {}) {
    super($settings, Subcycles)
  }
}