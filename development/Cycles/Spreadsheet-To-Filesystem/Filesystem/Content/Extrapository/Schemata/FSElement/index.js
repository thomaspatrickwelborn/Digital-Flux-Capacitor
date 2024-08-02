import FSSchema from './FS/index.js'
import ContentSchema from './Content/index.js'
import { ObjectId, Mixed, Schema } from 'mongoose'
const defaultSchemataOptions = {
  strict: true,
  validateBeforeSave: false,
  minimize: true,
}
const FSElement = new Schema({
  fs: FSSchema,
  content: ContentSchema,
}, defaultSchemataOptions)

export default FSElement