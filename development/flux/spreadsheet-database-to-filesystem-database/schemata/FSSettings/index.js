import { Schema } from 'mongoose'
// FS Settings Schema
const FSSettingsSchema = new Schema({
  id: Number,
  name: String,
  path: String,
  permissions: {
    r: Number, w: Number, x: Number,
  },
  operations: {
    add: Boolean,
    update: Boolean,
  },
  encoding: String,
  template: String,
  workspaces: [String],
  type: String,
}, {
  strict: false,
  validateBeforeSave: false,
})

export default FSSettingsSchema