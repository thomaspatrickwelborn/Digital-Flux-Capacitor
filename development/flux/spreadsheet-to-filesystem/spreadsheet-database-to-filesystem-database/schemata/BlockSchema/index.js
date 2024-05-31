import { Schema } from 'mongoose'
const BlockStatementSchema = new Schema({
  lexter: {
    ser: String,
    ten: String,
    per: String,
    ple: String,
  },
  dexter: {
    ser: String,
    ten: String,
    per: String,
    ple: String,
  }
}, {
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
  strict: false,
  validateBeforeSave: false,
})
const BlockSchema = new Schema({}, {
  strict: true,
  validateBeforeSave: false,
})
BlockSchema.add({
  element: BlockElementSchema,
  statement: BlockStatementSchema,
  blocks: [BlockSchema],
})
export default BlockSchema