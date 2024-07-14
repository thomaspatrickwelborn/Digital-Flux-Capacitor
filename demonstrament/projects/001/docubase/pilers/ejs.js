import fs from "node:fs/promises"
import path from "node:path"
import ejs from "ejs"
import {
  bufferToString
} from "./coutils/index.js"
import Piler from "./piler.js"
class EJSPiler extends Piler{
  length = 0
  constructor (
    $settings
  )
  {
    super (
      $settings
    )
  }
  async watcherChange(
    $path
  )
  {
    const watcherSettings = this.getWatcherSettingsByInputPath(
      $path
    )
    const fileModel =  await fs.readFile(
      watcherSettings.input[
        0
      ],
      'utf8'
    )
    .then(
      bufferToString
    )
    const fileTemplate =  await fs.readFile(
      watcherSettings.input[
        1
      ],
      'utf8'
    )
    .then(
      bufferToString
    )
    const filePath = watcherSettings.output
    const fileContent =  await ejs.render(
      fileTemplate,
      fileModel
    )
    await fs.writeFile(
      filePath,
      fileContent
    )
    return this
  }
}
export default EJSPiler