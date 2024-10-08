import { Schema } from 'mongoose'
const defaultSchemataOptions = {
  strict: true,
  validateBeforeSave: false,
  _id: false,
  minimize: true,
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