import RollupConfig from "./config.js"
import {
  EventEmitter
} from "node:events"
import {
  rollup,
  watch
} from "rollup"
class RollupPiler extends EventEmitter{
  length = 0
  constructor (){
    super ()
  }
  async start(){
    iterateRollupConfig:
    for (
      const $rollupConfig of RollupConfig
    )
    {
      const rollupBundle = watch(
        $rollupConfig
      )
      Array.prototype.push.call(
        this,
        rollupBundle
      )
    }
    return this
  }
  async stop(){
    for (
      $rollupBundle of this
    )
    {
      $rollupBundle.close()
      return this
    }
  }
}
export default RollupPiler