import { ObjectId, Mixed, Schema } from 'mongoose'
import ImportSchema from './Import/index.js'
import BlockSchema from './Block/index.js'
import ExportSchema from './Export/index.js'
const defaultSchemataOptions = {
  strict: true,
  validateBeforeSave: false,
  minimize: true,
  _id: false,
}
const ContentSchema = new Schema({
  imports: [ImportSchema],
  blocks: [BlockSchema],
  exports: [ExportSchema],
}, defaultSchemataOptions)

export default ContentSchema