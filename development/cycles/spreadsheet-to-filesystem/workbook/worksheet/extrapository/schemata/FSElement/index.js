import FSSchema from './FS/index.js'
import ImportSchema from './Import/index.js'
import BlockSchema from './Block/index.js'
import ExportSchema from './Export/index.js'
import { ObjectId, Mixed, Schema } from 'mongoose'
const defaultSchemataOptions = {
  strict: false,
  validateBeforeSave: false,
}
const FSElement = new Schema({
  fs: FSSchema,
  imports: [ImportSchema],
  blocks: [BlockSchema],
  exports: [ExportSchema],
}, defaultSchemataOptions)

export default FSElement