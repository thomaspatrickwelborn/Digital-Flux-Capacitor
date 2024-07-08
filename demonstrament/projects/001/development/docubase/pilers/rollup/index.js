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
    console.log(
      'RollupConfig', RollupConfig
    )
    iterateRollupConfig:
    for (
      const $rollupConfig of RollupConfig
    )
    {
      console.log(
        '$rollupConfig', $rollupConfig
      )
      const rollupBundle = watch(
        $rollupConfig
      )
      rollupBundle.on(
        'event',
        function rollupBundleEvent(
          $event
        )
        {
          console.log(
            $event.code, $event
          )
        }
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
      console.log(
        '$rollupBundle', $rollupBundle
      )
      return this
    }
  }
}
export default RollupPiler