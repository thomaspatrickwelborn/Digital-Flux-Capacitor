import { EventEmitter } from 'node:events'
import * as Cycles from '#Cycles/index.js'
class Capacitor extends EventEmitter {
  #settings = {}
  #_name
  #_path
  #_cycles
  constructor($settings = {}) {
    super()
    this.#settings = $settings
    this.#cycles
  }
  get #cycles() {
    if(this.#_cycles === undefined) {
      this.#_cycles = new Map()
      iterateCycles: 
      for(const $cycleSettings of this.#settings.cycles) {
        const { name, classname } = $cycleSettings
        const Cycle = Cycles[classname]
        const cycle = new Cycle($cycleSettings)
        this.#_cycles.set(name, cycle)
      }
    }
    return this.#_cycles
  }
}

export default Capacitor