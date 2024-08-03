import { EventEmitter } from 'node:events'
import { fillEmptyCells } from '#Coutil/index.js'
import assignProps from './assignProps/index.js'
import assignLMNProps from './assignLMNProps/index.js'
import assignPORProps from './assignPORProps/index.js'
const translexes = [
  ["assignProps", assignProps],
  ["assignLMNProps", assignLMNProps],
  ["assignPORProps", assignPORProps],
]

export default class Supposit extends EventEmitter {
  #settings
  content = {}
  constructor($settings = {}) {
    super()
    this.#settings = $settings
    let {
      nom, sup, com, modIndex, mods, lmnRanges
    } = this.#settings
    sup = fillEmptyCells(sup)
    const translexesLength = translexes.length
    var translexesIndex = 0
    while(translexesIndex < translexesLength) {
      const [
        $translexisName, $translexisMethod
      ] = translexes[translexesIndex]
      const translexisMethodType = $translexisMethod.constructor.name
      $translexisMethod(this.content, {
        modIndex, mods, nom, sup, com, lmnRanges
      })
      translexesIndex++
    }
  }
}
