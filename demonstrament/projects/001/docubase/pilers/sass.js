import fs from "node:fs/promises"
import * as sass from "sass"
import Piler from "./piler.js"
class SASSPiler extends Piler{
  constructor (
    $settings
  )
  {
    super (
      $settings = $settings
    )
  }
  async watcherChange(
    $path
  )
  {
    const watcherSettings = this.getWatcherSettingsByInputPath(
      $path
    )
    const fileContent =  await sass.compileAsync(
      watcherSettings.input
    )
    await fs.writeFile(
      watcherSettings.output,
      fileContent.css
    )
    return this
  }
}
export default SASSPiler