import { Schema } from 'mongoose'
const defaultSchemataOptions = {
  strict: false,
  validateBeforeSave: false,
  _id: false,
}
const ExportNameSchema = new Schema({
  name: String,
  alias: String,
}, defaultSchemataOptions)
const ExportSchema = new Schema({
  name: [ExportNameSchema],
  default: Boolean,
})
export default ExportSchema