import { Schema } from 'mongoose'
const defaultSchemaOptions = {
  _id: false, 
  strict: false,
  validateBeforeSave: false,
  minimize: true,
}
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
}, defaultSchemaOptions)
// Block Element Schema
const ElementAttributeSchema = new Schema({
  key: String,
  per: String, 
  val: String,
}, defaultSchemaOptions)
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
  attribute: ElementAttributeSchema,
  texts: [{
    ten: String,
  }],
}, defaultSchemaOptions)
const BlockSchema = new Schema({}, defaultSchemaOptions)
BlockSchema.add({
  element: BlockElementSchema,
  statement: BlockStatementSchema,
  blocks: [BlockSchema],

})
export default BlockSchema