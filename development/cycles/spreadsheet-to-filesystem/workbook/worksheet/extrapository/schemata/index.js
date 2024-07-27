import { ObjectId, Mixed, Schema } from 'mongoose'
import FSSettingsSchema from './FSSettings/index.js'
import { ImportSchema, BlockSchema, ExportSchema } from './FSElement/index.js'
const defaultSchemataOptions = {
  strict: false,
  validateBeforeSave: false,
}
// Fold Schema
const Fold = new Schema({
  fs: FSSettingsSchema,
}, defaultSchemataOptions)
// File Schema
const File = new Schema({
  fs: FSSettingsSchema,
  imports: [ImportSchema],
  blocks: [BlockSchema],
  exports: [ExportSchema],
}, defaultSchemataOptions)

export { File, Fold }