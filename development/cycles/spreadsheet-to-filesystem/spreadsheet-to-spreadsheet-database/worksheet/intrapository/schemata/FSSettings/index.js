import { Schema } from 'mongoose'
// FS Settings Schema
const FSSettingsSchema = new Schema({
  id: Number,
  name: String,
  path: String,
  permissions: {
    r: Number, 
    w: Number, 
    x: Number,
  },
  operations: {
    add: Boolean,
    update: Boolean,
    delete: Boolean, 
  },
  encoding: String,
  template: String,
  workspace: String,
  type: String,
}, {
  _id: false,
  strict: false,
  validateBeforeSave: false,
})

export default FSSettingsSchema