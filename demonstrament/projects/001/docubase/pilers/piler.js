import {
  EventEmitter
} from "node:events"
import chokidar from "chokidar"
class Piler extends EventEmitter{
  settings
  #_watcher
  get watcher(){
    return this.#_watcher
  }
  set watcher(
    $watcherSettings
  )
  {
    if (
      this.#_watcher === undefined
    )
    {
      this.#_watcher = chokidar.watch()
    }
    for (
      const $watcher of $watcherSettings
    )
    {
      this.watcher.add(
        $watcher.input
      )
    }
  }
  constructor (
    $settings
  )
  {
    super ()
    this.settings = $settings
    this.watcher = $settings
  }
  getWatcherSettingsByInputPath(
    $input
  )
  {
    return this.settings.find(
      function watcherSettingsFind(
        $watcherSettings
      )
      {
        return $watcherSettings.input === $input
      }
    )
  }
  start(){
    this.watcher.on(
      'add',
      this.watcherChange.bind(
        this
      )
    )
    this.watcher.on(
      'change',
      this.watcherChange.bind(
        this
      )
    )
    return this
  }
  stop(){
    this.watcher.close()
    return this
  }
}
export default Piler