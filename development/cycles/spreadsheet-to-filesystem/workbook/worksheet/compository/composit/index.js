import { EventEmitter } from 'node:events'
import { fillEmptyCells } from '#utils/index.js'
import assignProps from './assignProps/index.js'
import assignLMNProps from './assignLMNProps/index.js'
const translexes = [
  ["assignProps", assignProps],
  ["assignLMNProps", assignLMNProps],
]

export default class Composit extends EventEmitter {
  length = 0
  #settings = {}
  name
  #_supRows
  #_comRows
  constructor($settings = {}) {
    super()
    this.#settings = $settings
    const {
      nom, sup, com, modIndex, mods, merges, lmnRanges
    } = $settings
    this.name = nom
    this.supRows = sup
    this.comRows = com
  }
  get supRows() { return this.#_supRows }
  set supRows($supRows) {
    this.#_supRows = fillEmptyCells($supRows)
  }
  get comRows() { return this.#_comRows }
  set comRows($comRows) {
    this.#_comRows = $comRows
    const comRows = this.#_comRows
    const supRows  = this.supRows
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
  }
}
