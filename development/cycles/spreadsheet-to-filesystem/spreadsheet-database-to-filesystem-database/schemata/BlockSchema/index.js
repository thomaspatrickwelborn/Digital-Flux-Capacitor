import { Schema } from 'mongoose'
const BlockStatementSchema = new Schema({
  lexter: {
    ser: String,
    ten: String,
    per: String,
    pos: String,
    ple: String,
  },
  dexter: {
    ser: String,
    ten: String,
    per: String,
    pos: String,
    ple: String,
  }
}, {
  _id: false, 
  strict: false,
  validateBeforeSave: false,
})
// Block Element Schema
const BlockElementSchema = new Schema({
  tag: {
    per: String,
    name: String,
  },
  attribute: [{
    key: String,
    ten: String,
    per: String,
  }],
  data: [{
    key: String,
    ten: String,
    per: String,
  }],
  text: [{
    key: String,
    ten: String,
    per: String,
  }],
}, {
  _id: false, 
  strict: false,
  validateBeforeSave: false,
})
const BlockSchema = new Schema({}, {
  _id: false, 
  strict: true,
  validateBeforeSave: false,
})
BlockSchema.add({
  element: BlockElementSchema,
  statement: BlockStatementSchema,
  blocks: [BlockSchema],
})
export default BlockSchema