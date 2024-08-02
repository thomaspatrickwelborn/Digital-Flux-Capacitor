import { EventEmitter } from 'node:events'
import Composit from './Composit/index.js'
import Collect from './Collect/index.js'
export default class Compository extends EventEmitter {
  #database
  #_settings = {}
  #_options = {}
  #_composits = new Map()
  #_collects = new Map()
  constructor($depository = {}, $options = {}) {
    super()
    this.depository = $depository
    this.options = $options
    this.#database = this.options.database
    this.composits = this.depository
    this.collects = this.depository
  }
  get composits() { return this.#_composits }
  set composits($composits) {
    var { mods, ranges, merges, lmnRanges } = this.depository
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
        ranges,
        lmnRanges,
      }, this.options)
      collect.on(
        'saveCollectDoc', ($collectDoc) => {
          this.emit(
            'collect:saveCollectDoc', 
            $collectDoc
          )
        }
      )
      collect.on(
        'save', ($collect) => {
          this.emit(
            'collect:save', 
            $collect
          )
        }
      )
      _collects.set($modIndex, collect)
      modsIndex++
    }
  }
  async deleteCollects() {
    for(const $collect of this.collects.values()) {
      await $collect.delete()
    }
    this.emit(
      'deleteCollects', 
      this.collects
    )
    return this
  }
  async saveCollects() {
    for(const $collect of this.collects.values()) {
      await $collect.save()
    }
    this.emit(
      'saveCollects', 
      this.collects
    )
    return this
  }
}