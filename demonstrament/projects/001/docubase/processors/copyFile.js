import fs from "node:fs/promises"
import {
  globSync
} from "glob"
import Processor from "./processor.js"
class CopyFileProcessor extends Processor{
  constructor (){
    super()
  }
}
export default CopyFileProcessor