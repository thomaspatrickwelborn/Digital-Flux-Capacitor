import { Schema } from 'mongoose'
const BlockStatementSchema = new Schema({
  lexter: {
    ser: String,
    ten: String,
    per: String,
    pos: String,
    par: String,
  },
  dexter: {
    ser: String,
    ten: String,
    per: String,
    pos: String,
    par: String,
  }
}, {
  _id: false, 
  strict: false,
  validateBeforeSave: false,
})
// Block Element Schema
const BlockElementSchema = new Schema({
  tag: {
    name: String,
    pos: String,
  },
  attribute: [{
    key: String,
    pos: String,
    ten: String,
  }],
  data: [{
    key: String,
    pos: String,
    ten: String,
  }],
  text: [{
    pos: String,
    ten: String,
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