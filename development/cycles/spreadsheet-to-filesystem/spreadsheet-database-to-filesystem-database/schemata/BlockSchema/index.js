import { Schema } from 'mongoose'
const BlockStatementSchema = new Schema({
  lexter: {
    ser: String,
    ten: String,
    per: String,
    pos: {
      in: String,
      ex: String,
    },
    par: String,
  },
  dexter: {
    ser: String,
    ten: String,
    per: String,
    pos: {
      in: String,
      ex: String,
    },
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
    apos: {
      in: String,
      ex: String,
    },
    depos: {
      in: String,
      ex: String,
    },
  },
  attribute: {
    key: String,
    per: String, 
    val: String,
  },
  texts: [{
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
  coindex: {
    scope: Number,
    block: Number,
    blockLen: Number,
  },
  element: BlockElementSchema,
  statement: BlockStatementSchema,
  blocks: [BlockSchema],

})
export default BlockSchema