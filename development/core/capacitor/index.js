import { EventEmitter } from 'node:events'
import * as Cycles from '#cycles/index.js'
class Capacitor extends EventEmitter {
  #_settings = {}
  #_name
  get name() { return this.#_name }
  set name($name) { this.#_name = $name }
  #_path
  get path() { return this.#_path }
  set path($path) { this.#_path = $path }
  constructor($settings = {}) {
    super()
    this.Cycles = Cycles
    this.settings = $settings
    this.name = this.settings.name
    this.path = this.settings.path
    this.cycles = this.settings.cycles
  }
  get settings() { return this.#_settings }
  set settings($settings) { this.#_settings = $settings }
  #_Cycles
  get Cycles() { return this.#_Cycles }
  set Cycles($Cycles) { this.#_Cycles = $Cycles }
  #_cycles = new Map()
  get cycles() { return this.#_cycles }
  set cycles($cycles) {
    const _cycles = this.#_cycles
    iterateCycles: 
    for(const $cycleSettings of $cycles) {
      const { classname } = $cycleSettings
      const Cycle = this.Cycles[classname]
      const cycle = new Cycle($cycleSettings)
      _cycles.set($cycleName, cycle)
    }
    return this
  }
}

export default Capacitor