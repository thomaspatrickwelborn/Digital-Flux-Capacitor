import EventEmitter from 'node:events'
import path from 'node:path'
import url from 'node:url'
import { writeFile, readFile } from 'node:fs'
import Differatives from './Differatives/index.js'
import Operatives from './Operatives/index.js'
import Generatives from './Generatives/index.js'
import { Timer } from '#Coutil/index.js'
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
  get #deleteExtraneous() {
    return this.#settings.deleteExtraneous
  }
  get #differatives() {
    if(this.#_differatives === undefined) {
      this.#_differatives = new Differatives(
        Object.assign({
          root: this.#settings.root,
          database: this.#settings.database,
        }, this.#settings.differatives)
      )
    }
    return this.#_differatives
  }
  get #operatives() {
    if(this.#_operatives === undefined) {
      this.#_operatives = new Operatives(
        Object.assign({
          root: this.#settings.root,
          database: this.#settings.database,
        }, this.#settings.operatives)
      )
    }
    return this.#_operatives
  }
  get #generatives() {
    if(this.#_generatives === undefined) {
      this.#_generatives = new Generatives(
        Object.assign({
          root: this.#settings.root,
          database: this.#settings.database,
        }, this.#settings.generatives)
      )
    }
    return this.#_generatives
  }
  #mapCollectDocsToCollectDocPaths($collect) {
    return Array.from($collect)
    .map(
      ($collectDoc) => {
        const typeofCollectDoc = typeof $collectDoc
        if(typeofCollectDoc === 'string') {
          return $collectDoc
        } else
        if(
          typeofCollectDoc === 'object'
        ) {
          return $collectDoc.fs.path
        }
      }
    )
  }
  async delete($collects, $worksheet) {
    if(
      this.#deleteExtraneous === true &&
      $worksheet.name.match(new RegExp(/^VINE/))
    ) {
      for(const [
        $collectName, $collect
      ] of $collects.entries()) {
        const rootCollectPaths = this.#mapCollectDocsToCollectDocPaths(
          Array.from(this.#root)
        )
        const collectPaths = this.#mapCollectDocsToCollectDocPaths($collect)
        const deleteDifferative = this.#differatives.delete(
          rootCollectPaths,
          collectPaths
        )
        iterateDeleteDifferative:
        for(const $deleteDifferative of deleteDifferative) {
          this.#operatives.delete(
            $deleteDifferative
          )
        }
      }
    }
    return
  }
  async save($collectDoc) {
    const collectDoc = $collectDoc.toObject({
      lean: true,
    })
    const { operations, permissions, path } = collectDoc.fs || {}
    // ADD
    if(
      operations?.add &&
      this.#root.includes(path) === false
    ) {
      await this.#operatives.add(collectDoc)
      if(
        collectDoc.fs.type === 'File' &&
        collectDoc.content
      ) {
        await this.#generatives.file.add(collectDoc)
      }
    } else
    // UPDATE
    if(
      operations?.update &&
      this.#root.includes(path) === true
    ) {
      await this.#operatives.update(collectDoc)
      if(
        collectDoc.fs.type === 'File' &&
        collectDoc.content
      ) {
        await this.#generatives.file.update(collectDoc)
      }
    } else
    // DELETE
    if(
      operations?.delete &&
      this.#root.includes(path) === true
    ) {
        if(
          collectDoc.fs.type === 'File' &&
          collectDoc.content
        ) {
          await this.#operatives.file.delete(collectDoc)
        }
    }
  }
}