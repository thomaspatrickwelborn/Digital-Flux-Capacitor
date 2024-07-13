import {
  EventEmitter
} from "node:events"
import fs from "node:fs/promises"
import chokidar from "chokidar"
import * as sass from "sass"
class SASSPiler extends EventEmitter{
  #settings
  #_watcher
  get #watcher(){
    return this.#_watcher
  }
  set #watcher(
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
      this.#watcher.add(
        $watcher.input
      )
    }
  }
  constructor (
    $settings
  )
  {
    super ()
    this.#settings = $settings
    this.#watcher = $settings
  }
  #getWatcherSettingsByInputPath(
    $input
  )
  {
    return this.#settings.find(
      function watcherSettingsFind(
        $watcherSettings
      )
      {
        return $watcherSettings.input === $input
      }
    )
  }
  async start(){
    for (
      const $watcherSettings of this.#settings
    )
    {
      this.#watcher.on(
        'change',
        this.#watcherChange.bind(
          this
        )
      )
    }
  }
  async #watcherChange(
    $path
  )
  {
    const watcherSettings = this.#getWatcherSettingsByInputPath(
      $path
    )
    console.log(
      'watcherSettings', watcherSettings
    )
    const fileContent =  await sass.compileAsync(
      watcherSettings.input
    )
    console.log(
      'fileContent', fileContent
    )
    await fs.writeFile(
      watcherSettings.output,
      fileContent.css
    )
  }
  async stop(){}
}
export default SASSPiler