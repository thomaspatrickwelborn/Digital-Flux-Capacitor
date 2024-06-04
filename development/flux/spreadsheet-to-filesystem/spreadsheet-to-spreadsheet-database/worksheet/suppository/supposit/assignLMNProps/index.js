import { ObjectId } from 'mongoose'
import { typeOf } from '#utils/index.js'
import { LMNProps } from '#utils/defaults/index.js'

function assignLMNProps($supposit, $settings) {
	var { modIndex, mods, lmnRanges, sup, com } = $settings
	if(lmnRanges.length === 0) return $supposit
	// Mods
	const modNom = mods[modIndex][1].nom
	const modSup = mods[modIndex][1].sup
	const modCom = mods[modIndex][1].com
	// Mod Com Rows
	const modComRowsLength = modCom.length
	var modComRowsIndex = 0
	iterateModComRows: 
	while(modComRowsIndex < modComRowsLength) {
		const modComRow = modCom[modComRowsIndex]
		const modComRowLMNRangeData = lmnRanges.parseRow(modComRow)
		const modComRowLMNRangeIndex = modComRowLMNRangeData.LMN_INDEX
		var meterScopeIndex = modComRowLMNRangeIndex
		const modLMNRange = modComRowLMNRangeData.LMN
		if(modLMNRange === undefined) {
			modComRowsIndex++
			continue iterateModComRows
		}
		// Subduct Mods
		const subductModsLength = mods.length
		var subductModsIndex = modIndex
		iterateSubductMods: 
		while(subductModsIndex < subductModsLength) {
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
			iterateSubductModComRows: 
			while(subductModComRowsIndex < subductModComRowsLength) {
				const subductModComRow = subductModCom[subductModComRowsIndex]
				const subductModComRowLMNRangeData = lmnRanges.parseRow(subductModComRow)
				const subductModComRowLMNRangeIndex = subductModComRowLMNRangeData.LMN_INDEX
				if(subductModComRowLMNRangeIndex === -1) {
					subductModComRowsIndex++
					continue iterateSubductModComRows
				}
				const subductModComRowLMNRange = subductModComRowLMNRangeData.LMN
				if(subductModComRowLMNRange === undefined) {
					subductModComRowsIndex++
					continue iterateSubductModComRows
				}
				var subductMeterScopeIndex = subductModComRowLMNRangeIndex
				if(subductMeterScopeIndex <= meterScopeIndex) {
					modComRowsIndex++
					continue iterateModComRows
				} else
				if(subductMeterScopeIndex > meterScopeIndex + 1) {
					subductModComRowsIndex++
					continue iterateSubductModComRows
				}
				// Subduct Mod LMN Subset Range
				const subductModLMNSubsetRangeVal = subductModComRowLMNRangeData['SUBSET']
				// Subduct Mod LMN Supset Range
				const subductModLMNSupsetRangeVal = subductModComRowLMNRangeData['SUPSET']
				// Supter/Subter Property Assignments
				if($supposit[subductModLMNSupsetRangeVal] === undefined) {
					$supposit[subductModLMNSupsetRangeVal] = [{
						type: ObjectId,
						ref: subductModLMNSubsetRangeVal
					}]
				} else
				if($supposit[subductModLMNSupsetRangeVal].findIndex(
					($propSchema) => $propSchema.Ref === subductModLMNSubsetRangeVal
				) !== -1) { 
					$supposit[subductModLMNSupsetRangeVal].push({
						type: ObjectId,
						ref: subductModLMNSubsetRangeVal
					})
				}
				subductModComRowsIndex++
			}
			subductModsIndex++
		}
		modComRowsIndex++
	}
	return $supposit
}

export default assignLMNProps