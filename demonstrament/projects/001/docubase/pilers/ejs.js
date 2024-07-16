import fs from "node:fs/promises"
import path from "node:path"
import ejs from "ejs"
import prettier from "prettier"
import {
  bufferToString,
  bufferToJSON
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
      bufferToJSON
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
    const fileRenderOptions = watcherSettings.options
    const filePath = watcherSettings.output
    const fileData = {
      content: fileModel
    }
    const fileContent = ejs.render(
      fileTemplate,
      fileData,
      fileRenderOptions
    )
    const prettierFileContent =  await prettier.format(
      fileContent,
      watcherSettings.formatter.prettier
    )
    const baseTemplate =  await fs.readFile(
      watcherSettings.input[
        2
      ],
      'utf8'
    )
    .then(
      bufferToString
    )
    const baseData = {
      content: fileModel , 
      fileContent: prettierFileContent
    }
    const baseContent = ejs.render(
      baseTemplate,
      baseData,
      fileRenderOptions
    )
    const prettierBaseContent =  await prettier.format(
      baseContent,
      watcherSettings.formatter.prettier
    )
    await fs.writeFile(
      filePath,
      prettierBaseContent
    )
    return this
  }
}
export default EJSPiler