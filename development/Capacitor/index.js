import { EventEmitter } from 'node:events'
import * as Cycles from '#Cycles/index.js'
class Capacitor extends EventEmitter {
  #_settings = {}
  #_name
  #_path
  #_cycles = new Map()
  constructor($settings = {}) {
    super()
    this.#settings = $settings
    this.Cycles = Cycles
  }
  get #settings() { return this.#_settings }
  set #settings($settings) { this.#_settings = $settings }
  get #name() { return this.#settings.name }
  get #path() { return this.settings.path }
  get cycles() {
    if(this.#_cycles === undefined) {
      iterateCycles: 
      for(const $cycleSettings of this.#settings.cycles) {
        const { name, classname } = $cycleSettings
        const Cycle = Cycles[classname]
        const cycle = new Cycle($cycleSettings)
        this.#_cycles.set(name, cycle)
      }
    }
  }
  set cycles($cycles) {
    return this
  }
}

export default Capacitor