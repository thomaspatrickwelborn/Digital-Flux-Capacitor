import { combineMerge } from '#Coutil/index.js'
import deepmerge from 'deepmerge'
import Schemata from './Schemata/index.js'
import Models from './Models/index.js'
import { EventEmitter } from 'node:events'
import {
  reducers,
  populateOptions,
} from './Coutil/index.js'

export default class Extrapository extends EventEmitter {
  #settings
  get #database() { return this.#settings.database }
  #_models
  #_collects = new Map()
  #_fsIgnorePropertyKeys
  #_fsContentIgnorePropertyKeys
  constructor($settings = {}) {
    super()
    this.#settings = $settings
    this.#models
  }
  get #models() {
    if(this.#_models === undefined) {
      this.#_models = new Models()
    }
  }
  
  async saveCollects($collects, $worksheet) {
    const collects = this.#_collects
    if(
      $worksheet.name.match(new RegExp(/^VINE/))
    ) {
      for(const [
        $collectName, $collect
      ] of $collects.entries()) {
        const collect = await this.#fsElements($collect, $worksheet)
        collects.set($collectName, collect)
      }
    } else {
      for(const [
        $collectName, $collect
      ] of $collects.entries()) {
        const collect = await this.#fsElementContent($collect, $worksheet)
        collects.set($collectName, collect)
      }
    }
    return collects
  }
}