import { Schema } from 'mongoose'
const defaultSchemataOptions = {
  strict: false,
  validateBeforeSave: false,
  _id: false,
}
const ImportNameSchema = new Schema({
  name: String,
  alias: String,
  declare: String,
}, defaultSchemataOptions)
const ImportSchema = new Schema({
  name: [ImportNameSchema],
  default: Boolean,
  path: String,
}, defaultSchemataOptions)
export default ImportSchema