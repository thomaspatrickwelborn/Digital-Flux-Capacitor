import { ObjectId, Mixed, Schema } from 'mongoose'
import FSSettingsSchema from './FSSettings/index.js'
import { ImportSchema, ExportSchema } from './FSElement/index.js'
import BlockSchema from './BlockSchema/index.js'
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
	import: [ImportSchema],
	blocks: [BlockSchema],
	export: [ExportSchema],
}, defaultSchemataOptions)

export { File, Fold }