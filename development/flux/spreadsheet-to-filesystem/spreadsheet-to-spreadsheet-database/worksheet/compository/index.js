import Composit from './composit/index.js'
export default class extends Compository {
  #_settings = {}
  #_composits = new Map()
  #_collects = new Map()
  constructor($settings) {
    super()
    this.settings = $settings
  }
  set composits($composits) {
    const { mods, ranges, merges, lmnRanges } = this.settings
    mods = Array.from(mods.entries())
    const composits = this.composits
    const modsLength = mods.length 
    var modsIndex = 0
    while(modsIndex < modsLength) {
      const [$modIndex, $mod] = mods[modsIndex]
      const {
        nom, sup, com
      } = $mod
      var composit = await Composit({
        nom, sup, com, 
        ranges, lmnRanges, 
        modsIndex, mods,
        merges,
      })
      composits.set($modIndex, composit)
      modsIndex++
    }
  }
  get collects() { return this.#_collects }
  set collects($mods, $ranges, $composits, $lmnRanges) {
    $mods = Array.from($mods.entries())
    $composits = Array.from($composits.entries())
    this.collect = await Collect({
      mods: $mods, 
      composits: $composits, 
      dbConnection: this.#dbConnection,
      ranges: $ranges,
      lmnRanges: $lmnRanges,
    })
    return this.collect
  }
}