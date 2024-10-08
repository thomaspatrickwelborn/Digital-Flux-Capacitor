import { Schema } from 'mongoose'
// FS Schema
const FSSchema = new Schema({
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
  id: false,
  strict: true,
  validateBeforeSave: false,
})

export default FSSchema