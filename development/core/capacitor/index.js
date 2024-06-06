import { EventEmitter } from 'node:events'
import * as Cycles from '#cycles/index.js'
class Capacitor extends EventEmitter {
  #_settings = {}
  constructor($settings = {}) {
    super()
    this.Cycles = Cycles
    this.settings = $settings
    this.project = this.settings.project
    this.cycles = this.settings.cycles
  }
  get settings() { return this.#_settings }
  set settings($settings) { this.#_settings = $settings }
  #_Cycles
  get Cycles() { return this.#_Cycles }
  set Cycles($Cycles) { this.#_Cycles = $Cycles }
  #_project
  set project($project) {
    this.#_project = $project
    return this
  }
  #_cycles = new Map()
  get cycles() { return this.#_cycles }
  set cycles($cycles) {
    const _Cycles = this.#_Cycles
    const _cycles = this.#_cycles
    iterateCycles: 
    for(const [
      $cycleName, $cycleSettings
    ] of $cycles) {
      const Cycle = _Cycles[$cycleName]
      const cycle = new Cycle($cycleSettings)
      _cycles.set($cycleName, cycle)
    }
    return this
  }
}

export default Capacitor