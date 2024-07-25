import EventEmitter from 'node:events'
import Diff from './diff/index.js'
import Elements from './elements/index.js'
export default class Added extends EventEmitter {
  #_diff
  get diff() { return this.#_diff }
  set diff($diffSettings) {
    const { fs } = $diffSettings
    this.#_diff = Diff(fs.root, fs.vine)
  }
  #_elements
  get elements() { return this.#_elements }
  set elements($elementsSettings) {
    const {
      collection, fs
    } = $elementsSettings
    this.#_elements = new Elements({
      collection, 
      fs: fs, 
      addedDiff: this.diff
    })
    this.#_elements.on(
      'added:fold',
      ($addedFold) => this.emit('added:fold', $addedFold)
    )
    this.#_elements.on(
      'added:file',
      ($addedFile) => this.emit('added:file', $addedFile)
    )
  }
  constructor($settings = {}) {
    super()
    this.diff = $settings
    this.elements = $settings
  }
}