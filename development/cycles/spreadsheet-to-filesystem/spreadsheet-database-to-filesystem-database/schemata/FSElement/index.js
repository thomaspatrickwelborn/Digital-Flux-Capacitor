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
// FS Data Import Schema
const ImportSchema = new Schema({
  name: [ImportNameSchema],
  default: Boolean,
  path: String,
}, defaultSchemataOptions)
// FS Data Export Schema
const ExportNameSchema = new Schema({
  name: String,
  alias: String,
}, defaultSchemataOptions)
const ExportSchema = new Schema({
  name: [ExportNameSchema],
  default: Boolean,
})

export {
  ImportSchema,
  ExportSchema
}