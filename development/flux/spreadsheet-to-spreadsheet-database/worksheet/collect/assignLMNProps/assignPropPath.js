import { rowLMNRangeFromLMNRanges } from '#utils/index.js'

function assignPropPath($collect, $settings) {
	var { mods, lmnRanges, composits } = $settings
	const lmnRangesHavePAT = lmnRanges.reduce(
		($lmnRangesHavePAT, [$lmnRangeName, $lmnRange]) => {
			if($lmnRange.PAT !== undefined) $lmnRangesHavePAT = true
			return $lmnRangesHavePAT
		}, false
	)
	if(lmnRangesHavePAT === false) return $collect
	const modsEntries = Array.from(mods.entries())
	const modsLength = mods.length
	var modsIndex = 0
	const scopes = []
	var meterScopeIndex, preterScopeIndex
	var collectDocsIndex = 0
	iterateMods: while(modsIndex < modsLength) {
		const [$modIndex, $mod] = mods[modsIndex]
		const modNom = $mod.nom
		const modSup = $mod.sup
		const modCom = $mod.com
		// Iterate Mod Com Rows
		const modComRowsLength = modCom.length
		var modComRowsIndex = 0
		iterateModComRows: while(modComRowsIndex < modComRowsLength) {
			const collectDoc = $collect[collectDocsIndex]
			const modComRow = modCom[modComRowsIndex]
			const modComRowLMNRangeData = rowLMNRangeFromLMNRanges(modComRow, lmnRanges)
			const modComRowLMNRangeIndex = modComRowLMNRangeData.rowLMNRangeIndex
			const modComLMNRange = modComRowLMNRangeData.lmnRange
			preterScopeIndex = meterScopeIndex
			meterScopeIndex = modComRowLMNRangeIndex
			if(
				meterScopeIndex === preterScopeIndex ||
				preterScopeIndex === undefined
			) {
				scopes[meterScopeIndex] = collectDoc
			}
			if(meterScopeIndex < preterScopeIndex) {
				scopes.pop()
				scopes[meterScopeIndex] = collectDoc
			}
			if(meterScopeIndex > preterScopeIndex) {
				scopes[meterScopeIndex] = collectDoc
			}
			const path = []
			const scopesLength = scopes.length
			var scopesIndex = 0
			iterateScopes: while(scopesIndex < scopesLength) {
				const scopedDoc = scopes[scopesIndex]
				const modSupRowsLength = modSup.length
				var modSupRowsIndex = 0
				var prop = scopedDoc
				console.log('prop', prop)
				// if(prop[propKey]) break iterateModSupRows
				var propKey
				iterateModSupRows: while(modSupRowsIndex < modSupRowsLength) {
					const modSupRow = modSup[modSupRowsIndex]
					const modSupRowLMNRangeData = rowLMNRangeFromLMNRanges(modSupRow, lmnRanges)
					console.log('modSupRowLMNRangeData', modSupRowLMNRangeData)
					const modSupRowLMNRangeIndex = modSupRowLMNRangeData.rowLMNRangeIndex
					const modSupRowLMNRange = modSupRowLMNRangeData.rowLMNRange
					const anterModSupRow = modSup[modSupRowsIndex + 1]
					if(anterModSupRow === undefined) {
						break iterateModSupRows
					}
					const anterModSupRowLMNRangeData = rowLMNRangeFromLMNRanges(anterModSupRow, lmnRanges)
					console.log('anterModSupRowLMNRangeData', anterModSupRowLMNRangeData)
					const anterModSupRowLMNRangeIndex = anterModSupRowLMNRangeData.rowLMNRangeIndex
					if(anterModSupRowLMNRangeIndex === -1) 
					propKey = modSupRowLMNRange[0]
					if(anterModSupRowLMNRangeIndex === -1) {
						path.push(prop[propKey])
						scopesIndex++
						continue iterateScopes
					}
					prop = prop[propKey]
					modSupRowsIndex++
				}
				scopesIndex++
			}
			collectDoc[modComLMNRange['PAT'].Key] = path.join('/')
			collectDocsIndex++
			modComRowsIndex++
		}
		modsIndex++
	}
	return $collect
}

export default assignPropPath