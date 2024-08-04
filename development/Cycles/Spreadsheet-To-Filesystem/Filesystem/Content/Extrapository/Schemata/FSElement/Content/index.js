import { ObjectId, Mixed, Schema } from 'mongoose'
import ImportSchema from './Import/index.js'
import BlockSchema from './Block/index.js'
import ExportSchema from './Export/index.js'
const defaultSchemataOptions = {
  strict: true,
  validateBeforeSave: false,
  minimize: true,
  _id: false,
  id: false,
}
const ContentSchema = new Schema({
  imports: {
    type: [ImportSchema],
    required: false,
  },
  blocks: {
    type: [BlockSchema],
    required: false,
  },
  exports: {
    type: [ExportSchema],
    required: false,
  },
}, defaultSchemataOptions)

export default ContentSchema