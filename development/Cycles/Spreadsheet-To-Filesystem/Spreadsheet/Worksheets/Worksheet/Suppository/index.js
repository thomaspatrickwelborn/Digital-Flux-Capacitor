import { EventEmitter } from 'node:events'
import { Schema } from 'mongoose'
import Supposit from './Supposit/index.js'
export default class Suppository extends EventEmitter {
  #settings
  #options
  #_supposits
  #_schemata
  #_models
  constructor($depository = {}, $options = {}) {
    super()
    this.#settings = $depository
    this.#options = $options
    this.supposits
    this.schemata
    this.models
  }
  get supposits() {
    if(this.#_supposits !== undefined) return this.#_supposits
    this.#_supposits = new Map()
    var { mods, ranges, lmnRanges } = this.#settings
    mods = Array.from(mods.entries())
    const modsLength = mods.length
    var modsIndex = 0
    while(modsIndex < modsLength) {
      var [$modIndex, $mod] = mods[modsIndex]
      var { nom, sup, com } = $mod
      var supposit = new Supposit({
        nom, 
        sup, 
        com, 
        modIndex: $modIndex, 
        mods: mods,
        ranges: ranges, 
        lmnRanges: lmnRanges,
      })
      this.#_supposits.set(nom, supposit)
      modsIndex++
    }
    return this.#_supposits
  }
  get schemata() {
    if(this.#_schemata !== undefined) return this.#_schemata
    this.#_schemata = new Map()
    let { mods, ranges } = this.#settings
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
        var schema = new Schema(supposit.content, {
          strict: false,
          strictQuery: false,
        })
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
    return this.#_schemata
  }
  get models() {
    if(this.#_models !== undefined) return this.#_models
    this.#_models = new Map()
    let { mods, ranges } = this.#settings
    mods = Array.from(mods.entries())
    const schemata = this.schemata
    const modsLength = mods.length
    var modsIndex = 0
    while(modsIndex < modsLength) {
      var [$modIndex, $mod] = mods[modsIndex]
      var { nom, sup, com } = $mod
      var schema = schemata.get(nom)
      if(this.#_models[nom] === undefined) {
        var model = this.#options.database.models[nom] ||
        this.#options.database.model(nom, schema)
        this.#_models.set(nom, model)
      }
      modsIndex++
    }
    return this.#_models
  }
}