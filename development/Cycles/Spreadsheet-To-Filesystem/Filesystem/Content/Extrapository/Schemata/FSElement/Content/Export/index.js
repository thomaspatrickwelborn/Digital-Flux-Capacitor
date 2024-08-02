import { Schema } from 'mongoose'
const defaultSchemataOptions = {
  strict: true,
  validateBeforeSave: false,
  _id: false,
  minimize: true,
}
const ExportNameSchema = new Schema({
  name: String,
  alias: String,
}, defaultSchemataOptions)
const ExportSchema = new Schema({
  name: [ExportNameSchema],
  default: Boolean,
}, defaultSchemataOptions)
export default ExportSchema