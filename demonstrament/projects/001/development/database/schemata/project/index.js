import {
  Schema
} from 'mongoose'
const Project = new Schema({
  name: String,
  path: String,
  cycles: [],
}, {})