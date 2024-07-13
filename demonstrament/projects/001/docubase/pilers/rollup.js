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
    const rollupBundle =  await rollup(
      {
        input: watcherSettings.input
      }
    )
    console.log(
      watcherSettings.output,
      rollupBundle.generate
    )
    return this
  }
}