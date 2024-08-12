import { EventEmitter } from 'node:events'
import { fillEmptyCells } from '#Coutil/index.js'
import assignProps from './assignProps/index.js'
import assignLMNProps from './assignLMNProps/index.js'
const translexes = [
  ["assignProps", assignProps],
  ["assignLMNProps", assignLMNProps],
]

export default class Composit extends EventEmitter {
  #settings
  #_supRows
  #_comRows
  length = 0
  constructor($settings = {}) {
    super()
    this.#settings = $settings
    this.#supRows
    this.#comRows
  }
  get name() { this.#settings.nom }
  get #supRows() {
    if(this.#_supRows !== undefined) return this.#_supRows
    this.#_supRows = fillEmptyCells(this.#settings.sup)
    return this.#_supRows
  }
  get #comRows() {
    if(this.#_comRows !== undefined) return this.#_comRows
    this.#_comRows = this.#settings.com
    const comRows = this.#settings.com
    const supRows  = this.#supRows
    const comRowsLength = comRows.length
    var comRowsIndex = 0
    const composit = this
    const {
      nom, sup, com, modIndex, mods, merges, lmnRanges
    } = this.#settings
    while(comRowsIndex < comRowsLength) {
      const comRow = this.#_comRows[comRowsIndex]
      var apposit = {}
      const translexesLength = translexes.length
      var translexesIndex = 0
      while(translexesIndex < translexesLength) {
        const [$translexisName, $translexisMethod] = translexes[translexesIndex]
        const translexisMethodType = $translexisMethod.constructor.name
        apposit = $translexisMethod(apposit, {
          com, comRow, modIndex, mods, merges, sup, supRows, lmnRanges
        })
        translexesIndex++
      }
      Array.prototype.push.call(composit, apposit)
      comRowsIndex++
    }
    return this.#_comRows
  }
}
