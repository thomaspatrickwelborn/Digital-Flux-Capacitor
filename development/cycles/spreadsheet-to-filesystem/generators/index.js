import { EventEmitter } from 'node:events'
import FSElements from './FSElements/index.js'
import FSElementsContent from './FSElementContent/index.js'
export default class Generators extends EventEmitter {
  #settings
  #options
  #filesystem
  #dbConnections
  #_fsElements
  #_fsElementContent
  constructor($settings = {}) {
    super()
    this.#settings = $settings
    this.#filesystem = this.#settings.filesystem
    this.#dbConnections = this.#settings.dbConnections
    this.fsElements = this.#filesystem
  }
  get fsElements() { return this.#_fsElements }
  set fsElements($filesystem) {
    this.#_fsElements = new FSElements(
      $filesystem, this
    )

  }
  get fsElementContent() { return this.#_fsElementContent }
  set fsElementContent($fsElementContentSettings) {
    // this.fsElementContent = await FSElementsContent(
    //   fsElements, $presubcycle, this
    // )
  }
}
