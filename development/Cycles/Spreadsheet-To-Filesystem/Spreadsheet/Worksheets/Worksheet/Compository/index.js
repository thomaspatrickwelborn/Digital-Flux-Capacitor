import { EventEmitter } from 'node:events'
import Composit from './Composit/index.js'
import Collect from './Collect/index.js'
export default class Compository extends EventEmitter {
  #settings = {}
  #options = {}
  #_composits
  #_collects
  constructor($depository = {}, $options = {}) {
    super()
    this.#settings = $depository
    this.#options = $options
    this.composits
    this.collects
  }
  get composits() {
    if(this.#_composits !== undefined) return this.#_composits
    var { mods, ranges, merges, lmnRanges } = this.#settings
    mods = Array.from(mods.entries())
    this.#_composits = new Map()
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
      this.#_composits.set($modIndex, composit)
      modsIndex++
    }
    return this.#_composits
  }
  get collects() {
    if(this.#_collects !== undefined) return this.#_collects
    this.#_collects = new Map()
    var { mods, ranges, lmnRanges } = this.#settings
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
      }, this.#options)
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
      this.#_collects.set($modIndex, collect)
      modsIndex++
    }
    return this.#_collects
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