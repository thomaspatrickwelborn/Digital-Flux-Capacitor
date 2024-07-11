import {
  EventEmitter
} from "node:events"
import chokidar from "chokidar"
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
  stop(){
    for (
      $rollupBundle of this
    )
    {
      $rollupBundle.close()
      return this
    }
  }
}
export default Rollup