import {
  EventEmitter
} from "node:events"
import chokidar from "chokidar"
import {
  rollup,
  watch
} from "rollup"
class RollupPiler extends EventEmitter{
  #settings
  constructor (
    $settings
  )
  {
    super ()
    this.#settings = $settings
  }
  async start(){
    for (
      const $rollupConfig of this.#settings
    )
    {}
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
export default RollupPiler