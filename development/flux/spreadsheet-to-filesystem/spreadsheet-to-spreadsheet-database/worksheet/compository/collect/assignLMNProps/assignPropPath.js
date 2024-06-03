function assignPropPath($collect, $settings) {
	var { mods, lmnRanges, composits } = $settings
	if(lmnRanges.PAT === undefined) return $collect
	const modsLength = mods.length
	var modsIndex = 0
	const scopes = []
	var meterScopeIndex, preterScopeIndex
	var collectDocsIndex = 0
	iterateMods: 
	while(modsIndex < modsLength) {
		const [$modIndex, $mod] = mods[modsIndex]
		const modNom = $mod.nom
		const modSup = $mod.sup
		const modCom = $mod.com
		const modComRowsLength = modCom.length
		var modComRowsIndex = 0
		iterateModComRows: 
		while(modComRowsIndex < modComRowsLength) {
			const collectDoc = $collect[collectDocsIndex]
			const modComRow = modCom[modComRowsIndex]
			const modComRowLMNRangeData = lmnRanges.parseRow(modComRow, lmnRanges)
			if(modComRowLMNRangeData.LMN === undefined) {
				modComRowsIndex++
				continue iterateModComRows
			}
			preterScopeIndex = meterScopeIndex
			meterScopeIndex = modComRowLMNRangeData.LMN_INDEX
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
			iterateScopes: 
			while(scopesIndex < scopesLength) {
				const scopedDoc = scopes[scopesIndex]
				const modSupRowsLength = modSup.length
				var modSupRowsIndex = 0
				var prop = scopedDoc
				var propKey
				iterateModSupRows: 
				while(modSupRowsIndex < modSupRowsLength) {
					const modSupRow = modSup[modSupRowsIndex]
					const modSupRowLMNRangeData = lmnRanges.parseRow(modSupRow, lmnRanges)
					const anterModSupRow = modSup[modSupRowsIndex + 1]
					if(anterModSupRow === undefined) {
						break iterateModSupRows
					}
					const anterModSupRowLMNRangeData = lmnRanges.parseRow(anterModSupRow, lmnRanges)
					propKey = modSupRowLMNRangeData.LMN_VAL
					if(anterModSupRowLMNRangeData.LMN_INDEX === -1) {
						path.push(prop[propKey])
						scopesIndex++
						continue iterateScopes
					}
					prop = prop[propKey]
					modSupRowsIndex++
				}
				scopesIndex++
			}

			collectDoc[modComRowLMNRangeData.PAT.key] = path.join(modComRowLMNRangeData.PAT.delimiter)
			collectDocsIndex++
			modComRowsIndex++
		}
		modsIndex++
	}
	return $collect
}

export default assignPropPath