import { typeOf } from '#Coutil/index.js'
import { LMNProps } from '#Coutil/defaults/index.js'

async function assignProps($collect, $settings) {
  var { mods, lmnRanges, composits } = $settings
  const modsLength = mods.length
  var modsIndex = 0
  var collectDocsIndex = 0
  iterateMods: 
  while(modsIndex < modsLength) {
    const modNom = mods[modsIndex][1].nom
    const modSup = mods[modsIndex][1].sup
    const modCom = mods[modsIndex][1].com
    const modComRowsLength = modCom.length
    var modComRowsIndex = 0
    iterateModComRows: 
    while(modComRowsIndex < modComRowsLength) {
      const collectDoc = $collect[collectDocsIndex]
      const modComRow = modCom[modComRowsIndex]
      const modComRowRange = lmnRanges.parseRow(modComRow)
      var meterScopeIndex = modComRowRange.DEX
      const subductModsLength = mods.length
      var subductModsIndex = modsIndex
      var subductCollectDocsIndex = collectDocsIndex + 1
      iterateSubductMods: 
      while(subductModsIndex < subductModsLength) {
        const subductMod = mods[subductModsIndex][1]
        const subductModNom = subductMod.nom
        const subductModSup = subductMod.sup
        const subductModCom = subductMod.com
        const subductModComRowsLength = subductModCom.length
        var subductModComRowsIndex
        if(modsIndex === subductModsIndex) {
          subductModComRowsIndex = modComRowsIndex + 1
        } else {
          subductModComRowsIndex = 0
        }
        iterateSubductModComRows: 
        while(subductModComRowsIndex < subductModComRowsLength) {
          const subductCollectDoc = $collect[subductCollectDocsIndex]
          const subductModComRow = subductModCom[subductModComRowsIndex]
          const subductModComRowRange = lmnRanges.parseRow(subductModComRow)
          var subductMeterScopeIndex = subductModComRowRange.DEX
          if(subductMeterScopeIndex <= meterScopeIndex) {
            collectDocsIndex++
            modComRowsIndex++
            continue iterateModComRows
          } else
          if(subductMeterScopeIndex > meterScopeIndex + 1) {
            subductCollectDocsIndex++
            subductModComRowsIndex++
            continue iterateSubductModComRows
          }
          try {
            collectDoc.fs.populatePaths = collectDoc.fs.populatePaths || []
            if(
              subductModComRowRange.SUPSET !== undefined &&
              collectDoc.fs.populatePaths.includes(
                subductModComRowRange.SUPSET
              ) === false
            ) {
              collectDoc.fs.populatePaths.push(subductModComRowRange.SUPSET)
            }
            collectDoc[subductModComRowRange.SUPSET].push(subductCollectDoc._id)
          } catch($err) { /**/ }
          subductCollectDocsIndex++
          subductModComRowsIndex++
        }
        subductModsIndex++
      }
      collectDocsIndex++
      modComRowsIndex++
    }
    modsIndex++
  }
  return $collect
}

export default assignProps