import EventEmitter from 'node:events'
import path from 'node:path'
import { stat } from 'node:fs'
import url from 'node:url'
import { Functions, Parsers, Operators } from './Coutil/index.js'
import { writeFile, readFile } from 'node:fs'
import Operatives from './Operatives/index.js'
import Generatives from './Generatives/index.js'
const modulePath = path.dirname(
  url.fileURLToPath(import.meta.url)
)
export default class Extrapolatory extends EventEmitter {
  #settings
  #_templatives
  #_operatives
  #_generatives
  constructor($settings = {}) {
    super()
    this.#settings = $settings
  }
  get #root() { return this.#settings.root }
  get #operatives() {
    if(this.#_operatives === undefined) {
      this.#_operatives = new Operatives(
        this.#settings
      )
    }
    return this.#_operatives
  }
  get #generatives() {
    if(this.#_generatives === undefined) {
      this.#_generatives = new Generatives(
        this.#settings
      )
    }
    return this.#_generatives
  }
  input($collectDoc) {
    const collectDoc = $collectDoc.toObject({
      lean: true
    })
    const { operations, permissions, path } = collectDoc.fs
    if(
      operations.add === true &&
      this.#root.includes(path) === false
    ) {
      this.#operatives.add(collectDoc)
    } else
    if(
      operations.update === true &&
      this.#root.includes(path) === true
    ) {
      this.#operatives.update(collectDoc)
    } else
    if(
      operations.delete === true &&
      this.#root.includes(path) === true
    ) {
      this.#operatives.delete(collectDoc)
    }
  }
}