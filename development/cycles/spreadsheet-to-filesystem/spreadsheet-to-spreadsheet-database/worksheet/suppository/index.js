import { EventEmitter } from 'node:events'
import { Schema } from 'mongoose'
import deepmerge from 'deepmerge'
import { combineMerge } from '#utils/index.js'
import Supposit from './supposit/index.js'
export default class Suppository extends EventEmitter {
  #settings
  #options
  #dbConnection
  #_supposits = new Map()
  #_schemata = new Map()
  #_models = new Map()
  constructor($settings = {}, $options = {}) {
    super()
    this.#settings = $settings
    this.#options = $options
    this.#dbConnection = this.#options.dbConnection
    this.supposits = this.#settings
    this.schemata = this.#settings
    this.models = this.#settings
    console.log(this)
  }
  get supposits() { return this.#_supposits }
  set supposits($supposits) {
    const _supposits = this.#_supposits
    var { mods, ranges, lmnRanges } = $supposits
    mods = Array.from(mods.entries())
    const modsLength = mods.length
    var modsIndex = 0
    while(modsIndex < modsLength) {
      var [$modIndex, $mod] = mods[modsIndex]
      var { nom, sup, com } = $mod
      var supposit = new Supposit({
        nom, sup, com, 
        modIndex: $modIndex, 
        mods: mods,
        ranges: ranges, 
        lmnRanges: lmnRanges,
      })
      _supposits.set(nom, supposit)
      modsIndex++
    }
  }
  get schemata() { return this.#_schemata }
  set schemata($schemata) {
    let { mods, ranges } = $schemata
    mods = Array.from(mods.entries())
    const supposits = this.supposits
    const modsLength = mods.length
    var modsIndex = 0
    const schemata = this.schemata
    while(modsIndex < modsLength) {
      var [$modIndex, $mod] = mods[modsIndex]
      var { nom } = $mod
      const supposit = supposits.get(nom)
      if(schemata.has(nom) === false) {
        var schema = new Schema(supposit.content)
        if(schemata.has(nom)) {
          schemata.set(nom, merge(
            schemata.get(nom), schema
          ))
        } else {
          schemata.set(nom, schema)
        }
      }
      modsIndex++
    }
    return schemata
  }
  get models() { return this.#_models }
  set models($models) {
    let { mods, ranges } = $models
    mods = Array.from(mods.entries())
    const schemata = this.schemata
    const modsLength = mods.length
    var modsIndex = 0
    const _models = this.#_models
    while(modsIndex < modsLength) {
      var [$modIndex, $mod] = mods[modsIndex]
      var { nom, sup, com } = $mod
      var schema = schemata.get(nom)
      if(_models[nom] === undefined) {
        var model = this.#dbConnection.models[nom] ||
        this.#dbConnection.model(nom, schema)
        _models.set(nom, model)
      }
      modsIndex++
    }
  }
}