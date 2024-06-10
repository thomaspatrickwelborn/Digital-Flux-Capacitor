import {
  Schema
} from 'mongoose'
import Cycle from 'cycle/index.js'
const Project = new Schema({
  name: String,
  path: String,
  cycles: [],
}, {})
export default Project