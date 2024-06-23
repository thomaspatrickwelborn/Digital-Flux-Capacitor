import { ObjectId } from 'mongoose'
import { typeOf } from '#utils/index.js'
import { LMNProps } from '#utils/defaults/index.js'

function assignLMNProps($supposit, $settings) {
	$supposit.coindex = {
		type: {
			scope: Number,
		}
	}
	var { modIndex, mods, lmnRanges, sup, com } = $settings
	if(lmnRanges.length === 0) return $supposit
	const mod = mods[modIndex][1]
	const modNom = mod.nom
	const modSup = mod.sup
	const modCom = mod.com
	const modComRowsLength = modCom.length
	var modComRowsIndex = 0
	// Iterate Mod Com Rows
	iterateModComRows: 
	while(modComRowsIndex < modComRowsLength) {
		const modComRow = modCom[modComRowsIndex]
		const modComRowRange = lmnRanges.parseRow(modComRow)
		var meterScopeIndex = modComRowRange['DEX']
		const modLMNRange = modComRowRange['VAL']
		if(modLMNRange === undefined) {
			modComRowsIndex++
			continue iterateModComRows
		}
		// Subduct Mods
		const subductModsLength = mods.length
		var subductModsIndex = modIndex
		// Iterate Subduct Mods
		iterateSubductMods: 
		while(subductModsIndex < subductModsLength) {
			const subductMod = mods[subductModsIndex][1]
			const subductModNom = subductMod.nom
			const subductModSup = subductMod.sup
			const subductModCom = subductMod.com
			const subductModComRowsLength = subductModCom.length
			var subductModComRowsIndex
			if(modIndex === subductModsIndex) {
				subductModComRowsIndex = modComRowsIndex + 1
			} else {
				subductModComRowsIndex = 0
			}
			// Iterate Subduct Mod Com Rows
			iterateSubductModComRows: 
			while(subductModComRowsIndex < subductModComRowsLength) {
				const subductModComRow = subductModCom[subductModComRowsIndex]
				const subductModComRowRange = lmnRanges.parseRow(subductModComRow)
				if(subductModComRowRange['DEX'] === -1) {
					subductModComRowsIndex++
					continue iterateSubductModComRows
				}
				const subductModComRowLMNRange = subductModComRowRange['VAL']
				if(subductModComRowLMNRange === undefined) {
					subductModComRowsIndex++
					continue iterateSubductModComRows
				}
				if(subductModComRowRange['DEX'] <= meterScopeIndex) {
					modComRowsIndex++
					continue iterateModComRows
				} else
				if(subductModComRowRange['DEX'] > meterScopeIndex + 1) {
					subductModComRowsIndex++
					continue iterateSubductModComRows
				}
				if($supposit[subductModComRowRange['SUPSET']] === undefined) {
					$supposit[subductModComRowRange['SUPSET']] = [{
						type: ObjectId,
						ref: subductModComRowRange['SUBSET']
					}]
				} else
				if($supposit[subductModComRowRange['SUPSET']].findIndex(
					($propSchema) => $propSchema.Ref === subductModComRowRange['SUBSET']
				) !== -1) { 
					$supposit[subductModComRowRange['SUPSET']].push({
						type: ObjectId,
						ref: subductModComRowRange['SUBSET']
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