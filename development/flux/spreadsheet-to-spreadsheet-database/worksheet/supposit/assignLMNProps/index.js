import { ObjectId } from 'mongoose'
import { typeOf } from '#utils/index.js'
import { LMNProps } from '#utils/defaults/index.js'
import { rowLMNRangeFromLMNRanges } from '#utils/index.js'

function assignLMNProps($prop, $settings) {
	var { modIndex, mods, lmnRanges, sup, com } = $settings
	if(lmnRanges.length === 0) return $prop
	// Mods
	const modNom = mods[modIndex][1].nom
	const modSup = mods[modIndex][1].sup
	const modCom = mods[modIndex][1].com
	// Mod Com Rows
	const modComRowsLength = modCom.length
	var modComRowsIndex = 0
	iterateModComRows: while(modComRowsIndex < modComRowsLength) {
		const modComRow = modCom[modComRowsIndex]
		const modComRowLMNRangeData = rowLMNRangeFromLMNRanges(modComRow, lmnRanges)
		const modComRowLMNRangeIndex = modComRowLMNRangeData.comRowLMNRangeIndex
		const modComRowLMNRange = modComRowLMNRangeData.comRowLMNRange
		var meterScopeIndex = modComRowLMNRangeIndex
		const modLMNRange = modComRowLMNRangeData.lmnRange
		if(modLMNRange['PAT'] !== undefined) {
			$prop[modLMNRange['PAT'].Key] = String
		}
		// Subduct Mods
		const subductModsLength = mods.length
		var subductModsIndex = modIndex
		iterateSubductMods: while(subductModsIndex < subductModsLength) {
			const subductMod = mods[subductModsIndex][1]
			const subductModNom = subductMod.nom
			const subductModSup = subductMod.sup
			const subductModCom = subductMod.com
			// Subduct Mod Com Rows
			const subductModComRowsLength = subductModCom.length
			var subductModComRowsIndex
			if(modIndex === subductModsIndex) {
				subductModComRowsIndex = modComRowsIndex + 1
			} else {
				subductModComRowsIndex = 0
			}
			iterateSubductModComRows: while(subductModComRowsIndex < subductModComRowsLength) {
				const subductModComRow = subductModCom[subductModComRowsIndex]
				const subductModComRowLMNRangeData = rowLMNRangeFromLMNRanges(subductModComRow, lmnRanges)
				const subductModComRowLMNRangeIndex = subductModComRowLMNRangeData.comRowLMNRangeIndex
				const subductModComRowLMNRange = subductModComRowLMNRangeData.comRowLMNRange
				const subductModLMNRange = subductModComRowLMNRangeData.lmnRange
				var subductMeterScopeIndex = subductModComRowLMNRangeIndex
				if(subductMeterScopeIndex <= meterScopeIndex) {
					modComRowsIndex++
					continue iterateModComRows
				}
				if(subductMeterScopeIndex > meterScopeIndex + 1) {
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
				$prop[subductModLMNSupsetRangeVal] = $prop[subductModLMNSupsetRangeVal] || []
				const propSubsetIndex = $prop[subductModLMNSupsetRangeVal]
				.findIndex(($subDoc) => $subDoc.ref === subductModLMNSupsetRangeVal)
				if(propSubsetIndex === -1) {
					$prop[subductModLMNSupsetRangeVal].push({
						type: ObjectId,
						ref: subductModLMNSubsetRangeVal
					})
				} else {
					$prop[subductModLMNSubsetRangeVal][propSubsetIndex] = {
						type: ObjectId,
						ref: subductModLMNSubsetRangeVal
					}
				}
				subductModComRowsIndex++
			}
			subductModsIndex++
		}
		modComRowsIndex++
	}
	return $prop
}

export default assignLMNProps