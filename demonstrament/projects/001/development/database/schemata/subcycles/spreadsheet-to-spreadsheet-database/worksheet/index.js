import {
  Schema
} from 'mongoose'
const Worksheet = new Schema({
  ranges: {
    type: Map,
    of: WorksheetRangeSchema
  }
}, {})
export default Worksheet