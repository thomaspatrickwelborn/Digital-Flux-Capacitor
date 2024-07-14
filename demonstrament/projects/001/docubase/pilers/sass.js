import fs from "node:fs/promises"
import path from "node:path"
import * as sass from "sass"
import Piler from "./piler.js"
class SASSPiler extends Piler{
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
    const fileContentPile =  await sass.compileAsync(
      watcherSettings.input
    )
    const fileContent = fileContentPile.css
    const filePath = watcherSettings.output
    await fs.writeFile(
      filePath,
      fileContent
    )
    return this
  }
}
export default SASSPiler