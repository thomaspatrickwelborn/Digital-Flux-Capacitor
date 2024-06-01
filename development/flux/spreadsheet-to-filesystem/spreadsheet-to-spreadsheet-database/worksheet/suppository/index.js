import Supposit from './supposit/index.js'
export default class Suppository extends EventTarget {
  #dbConnection
  #_supposits = new Map()
  #_schemata = new Map()
  #_models = new Map()
  constructor($settings) {
    super()
    this.settings = $settings
  }
  get supposits() {}
  set supposits($supposits) {
    var { mods, ranges, lmnRanges } = $supposits
    mods = Array.from(mods.entries())
    const modsLength = mods.length
    var modsIndex = 0
    const supposits = this.supposits
    while(modsIndex < modsLength) {
      var [$modIndex, $mod] = mods[modsIndex]
      var { nom, sup, com } = $mod
      var supposit = Supposit({
        nom, sup, com, 
        modIndex: $modIndex, 
        mods: mods,
        ranges: ranges, 
        lmnRanges: lmnRanges,
        // merges: this.#getMerges({ includeHidden: false }),
      })
      supposits.set(nom, deepmerge(
        supposits.get(nom) || {},
        supposit,
        { arrayMerge: combineMerge },
      ))
      modsIndex++
    }
  }
  get schemata() { return this.#_schemata }
  set schemata($schemata) {
    const { mods, ranges } = $schemata
    $mods = Array.from($mods.entries())
    const supposits = this.supposits
    const modsLength = $mods.length
    var modsIndex = 0
    const schemata = this.schemata
    while(modsIndex < modsLength) {
      var [$modIndex, $mod] = $mods[modsIndex]
      var { nom } = $mod
      const supposit = supposits.get(nom)
      if(schemata.has(nom) === false) {
        var schema = new Schema(supposit)
        schemata.set(nom, schema)
      }
      modsIndex++
    }
    return schemata
  }
  models($models) {
    const { mods, ranges, merges } = $models
    $mods = Array.from($mods.entries())
    const schemata = this.schemata
    const modsLength = $mods.length
    var modsIndex = 0
    const models = this.models
    while(modsIndex < modsLength) {
      var [$modIndex, $mod] = $mods[modsIndex]
      var { nom, sup, com } = $mod
      var schema = schemata.get(nom)
      if(models[nom] === undefined) {
        var model = this.#dbConnection.model(nom, schema)
        models.set(nom, model)
      }
      modsIndex++
    }
    return models
  }
}