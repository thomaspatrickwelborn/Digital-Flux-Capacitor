import {
  Schema
} from 'mongoose'
const ProjectSchema = new Schema({
  name: String,
  path: String,
}, {})
export default ProjectSchema