import { EventEmitter } from 'node:events'
import Composit from './composit/index.js'
import Collect from './collect/index.js'
export default class Compository extends EventEmitter {
  #dbConnection
  #_settings = {}
  #_options = {}
  #_composits = new Map()
  #_collects = new Map()
  constructor($settings = {}, $options = {}) {
    super()
    this.settings = $settings
    this.options = $options
    this.#dbConnection = this.options.dbConnection
    this.composits = this.settings
    this.collects = this.settings
  }
  get composits() { return this.#_composits }
  set composits($composits) {
    var { mods, ranges, merges, lmnRanges } = this.settings
    mods = Array.from(mods.entries())
    const _composits = this.#_composits
    const modsLength = mods.length 
    var modsIndex = 0
    while(modsIndex < modsLength) {
      const [$modIndex, $mod] = mods[modsIndex]
      const {
        nom, sup, com
      } = $mod
      var composit = new Composit({
        nom, sup, com,  
        ranges, lmnRanges, 
        modsIndex, mods,
        merges,
      })
      _composits.set($modIndex, composit)
      modsIndex++
    }
  }
  get collects() { return this.#_collects }
  set collects($collects) {
    const _collects = this.#_collects
    var { mods, ranges, lmnRanges } = $collects
    mods = Array.from(mods.entries())
    var composits = Array.from(this.composits.entries())
    const modsLength = mods.length 
    var modsIndex = 0
    while(modsIndex < modsLength) {
      const [$modIndex, $mod] = mods[modsIndex]
      const collect = new Collect({
        mods, 
        composits, 
        dbConnection: this.#dbConnection,
        ranges,
        lmnRanges,
      })
      _collects.set($modIndex, collect)
      modsIndex++
    }
  }
  async saveCollects() {
    for(const $collect of this.collects.values()) {
      await $collect.save()
    }
    return this
  }
}