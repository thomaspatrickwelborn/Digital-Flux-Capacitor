import { typeOf } from '#utils/index.js'
import { LMNProps } from '#utils/defaults/index.js'
import { rowLMNRangeFromLMNRanges } from '#utils/index.js'
import assignPropPath from './assignPropPath.js'

async function assignProps($collect, $settings) {
	var { mods, lmnRanges, composits } = $settings
	const modsLength = mods.length
	var modsIndex = 0
	var collectDocsIndex = 0
	iterateMods: while(modsIndex < modsLength) {
		// Mods
		const modNom = mods[modsIndex][1].nom
		const modSup = mods[modsIndex][1].sup
		const modCom = mods[modsIndex][1].com
		// Mod Com Rows
		const modComRowsLength = modCom.length
		var modComRowsIndex = 0
		iterateModComRows: while(modComRowsIndex < modComRowsLength) {
			const collectDoc = $collect[collectDocsIndex]
			const modComRow = modCom[modComRowsIndex]
			const modComRowLMNRangeData = rowLMNRangeFromLMNRanges(modComRow, lmnRanges)
			const modComRowLMNRangeIndex = modComRowLMNRangeData.rowLMNRangeIndex
			const modComRowLMNRange = modComRowLMNRangeData.rowLMNRange
			var meterScopeIndex = modComRowLMNRangeIndex
			const modLMNRange = modComRowLMNRangeData.lmnRange
			// Subduct Mods
			const subductModsLength = mods.length
			var subductModsIndex = modsIndex
			var subductCollectDocsIndex = collectDocsIndex + 1
			iterateSubductMods: while(subductModsIndex < subductModsLength) {
				const subductMod = mods[subductModsIndex][1]
				const subductModNom = subductMod.nom
				const subductModSup = subductMod.sup
				const subductModCom = subductMod.com
				// Subduct Mod Com Rows
				const subductModComRowsLength = subductModCom.length
				var subductModComRowsIndex
				if(modsIndex === subductModsIndex) {
					subductModComRowsIndex = modComRowsIndex + 1
				} else {
					subductModComRowsIndex = 0
				}
				iterateSubductModComRows: while(subductModComRowsIndex < subductModComRowsLength) {
					const subductCollectDoc = $collect[subductCollectDocsIndex]
					const subductModComRow = subductModCom[subductModComRowsIndex]
					const subductModComRowLMNRangeData = rowLMNRangeFromLMNRanges(subductModComRow, lmnRanges)
					const subductModComRowLMNRangeIndex = subductModComRowLMNRangeData.rowLMNRangeIndex
					const subductModComRowLMNRange = subductModComRowLMNRangeData.rowLMNRange
					const subductModLMNRange = subductModComRowLMNRangeData.lmnRange
					var subductMeterScopeIndex = subductModComRowLMNRangeIndex
					if(subductMeterScopeIndex <= meterScopeIndex) {
						collectDocsIndex++
						modComRowsIndex++
						continue iterateModComRows
					}
					if(subductMeterScopeIndex > meterScopeIndex + 1) {
						subductCollectDocsIndex++
						subductModComRowsIndex++
						continue iterateSubductModComRows
					}
					// Subduct Mod LMN Subset Range
					const subductModLMNSubsetRange = subductModLMNRange['SUBSET']
					const subductModLMNSubsetRangeVal = subductModLMNSubsetRange.Key || subductModComRow
					.slice(subductModLMNSubsetRange.Ref.s.c, subductModLMNSubsetRange.Ref.e.c + 1)[0]
					// Subduct Mod LMN Supset Range
					const subductModLMNSupsetRange = subductModLMNRange['SUPSET']
					const subductModLMNSupsetRangeVal = subductModLMNSupsetRange.Key || subductModComRow
					.slice(subductModLMNSupsetRange.Ref.s.c, subductModLMNSupsetRange.Ref.e.c + 1)[0]
					// Supter/Subter Property Assignments
					collectDoc[subductModLMNSupsetRangeVal].push(subductCollectDoc._id)
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