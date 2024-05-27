import filesystemDatabaseToFilesystem from './filesystem-database-to-filesystem/index.js'
import spreadsheetDatabaseToFilesystemDatabase from './spreadsheet-database-to-filesystem-database/index.js'
import spreadsheetToSpeadsheetDatabase from './spreadsheet-to-spreadsheet-database/index.js'
export default {
  'filesystem-database-to-filesystem': filesystemDatabaseToFilesystem,
  'spreadsheet-database-to-filesystem-database': spreadsheetDatabaseToFilesystemDatabase,
  'spreadsheet-to-spreadsheet-database': spreadsheetToSpeadsheetDatabase,
}