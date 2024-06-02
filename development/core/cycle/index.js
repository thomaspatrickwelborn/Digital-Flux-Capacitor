import { typeOf } from '#utils/index.js'
import { EventEmitter } from 'node:events'

class Cycle extends EventEmitter {
  #_settings = {}
  constructor($settings = {}, $Subcycles = {}) {
    super()
    this.settings = $settings
    this.Subcycles = $Subcycles
    this.subcycles = this.settings.subcycles
  }
  get settings() { return this.#_settings }
  set settings($settings) { this.#_settings = $settings }
  #_Subcycles = {}
  get Subcycles() { return this.#_Subcycles }
  set Subcycles($Subcycles) { this.#_Subcycles = $Subcycles }
  #_subcycles = new Map()
  get subcycles() { return this.#_subcycles }
  set subcycles($subcycles) {
    const _Subcycles = this.#_Subcycles
    const _subcycles = this.#_subcycles
    const subcyclesLength = $subcycles.length
    var subcyclesIndex = 0
    while(subcyclesIndex < subcyclesLength) {
      const [
        $subcycleName, $subcycleSettings
      ] = $subcycles[subcyclesIndex]
      if(subcyclesIndex > 0) {
        $subcycleSettings.preflux = Array.from(
          subcycles.values()
        )
        .at(subcyclesIndex - 1)
      }
      const Subcycle = _Subcycles[$subcycleName]
      const subcycle = new Subcycle($subcycleSettings)
      _subcycles.set($subcycleName, subcycle)
      subcyclesIndex++
    }
    return this
  }
}

export default Cycle