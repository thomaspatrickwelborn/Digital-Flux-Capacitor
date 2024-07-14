import fs from "node:fs/promises"
import path from "node:path"
import ejs from "ejs"
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
    const fileContent =  await ejs.renderFile(
      watcherSettings.input
    )
  }
}
export default EJSPiler