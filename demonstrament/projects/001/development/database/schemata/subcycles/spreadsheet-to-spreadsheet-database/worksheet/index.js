import {
  Schema
} from 'mongoose'
import WorksheetRange from 'range/index.js'
const Worksheet = new Schema({
  ranges: {
    type: Map,
    of: WorksheetRangeSchema
  }
}, {})
export default Worksheet