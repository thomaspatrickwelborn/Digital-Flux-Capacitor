import EventEmitter from 'node:events'
import path from 'node:path'
import { stat } from 'node:fs'
import url from 'node:url'
import { writeFile, readFile } from 'node:fs'
import Differatives from './Differatives/index.js'
import Operatives from './Operatives/index.js'
import Generatives from './Generatives/index.js'
const modulePath = path.dirname(
  url.fileURLToPath(import.meta.url)
)
export default class Extrapolatory extends EventEmitter {
  #settings
  #_differatives
  #_operatives
  #_generatives
  constructor($settings = {}) {
    super()
    this.#settings = $settings
  }
  get #root() { return this.#settings.root }
  get #differatives() {
    if(this.#_differatives === undefined) {
      this.#_differatives = new Differatives(
        this.#settings
      )
    }
    return this.#_differatives
  }
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
  #mapCollectDocsToCollectDocPaths($collect) {
    return Array.from($collect)
    .map(
      ($collectDoc) => $collectDoc.fs.path
    )
  }
  async saveCollects($collects, $worksheet) {
    // const collects = this.#_collects
    if(
      $worksheet.name.match(new RegExp(/^VINE/))
    ) {
      for(const [
        $collectName, $collect
      ] of $collects.entries()) {
        const collectPaths = this.#mapCollectDocsToCollectDocPaths($collect)
        console.log(
          'this.#differatives.add', 
          this.#differatives.add(
            Array.from(this.#root), 
            collectPaths
          )
        )
        console.log(
          'this.#differatives.update', 
          this.#differatives.update(
            Array.from(this.#root), 
            collectPaths
          )
        )
        console.log(
          'this.#differatives.delete', 
          this.#differatives.delete(
            Array.from(this.#root), 
            collectPaths
          )
        )
        // console.log('$collect', $collect)
        // console.log('this.#root', this.#root)
      }
    }
    // return collects
  }
  async input($collectDoc) {
    const collectDoc = $collectDoc.toObject({
      lean: true
    })
    const { operations, permissions, path } = collectDoc.fs
    if(
      operations.add === true &&
      this.#root.includes(path) === false
    ) {
      await this.#operatives.add(collectDoc)
      await this.#generatives.file.add(collectDoc)
    } else
    if(
      operations.update === true &&
      this.#root.includes(path) === true
    ) {
      await this.#operatives.update(collectDoc)
      await this.#generatives.file.update(collectDoc)
    } else
    if(
      operations.delete === true &&
      this.#root.includes(path) === true
    ) {
      await this.#operatives.file.delete(collectDoc)
    }
  }
}