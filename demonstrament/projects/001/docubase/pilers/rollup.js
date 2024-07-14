import fs from "node:fs/promises"
import path from "node:path"
import {
  rollup
} from "rollup"
import Piler from "./piler.js"
class RollupPiler extends Piler{
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
    const rollupBundle =  await rollup(
      {
        input: watcherSettings.input
      }
    )
    const fileContentGeneration =  await rollupBundle.generate(
      {
        format: watcherSettings.output.format
      }
    )
    const fileContent = fileContentGeneration.output[
      0
    ]
    .code
    const filePath = path.join(
      watcherSettings.output.dir,
      watcherSettings.output.file
    )
    await fs.writeFile(
      filePath,
      fileContent
    )
    return this
  }
}
export default RollupPiler