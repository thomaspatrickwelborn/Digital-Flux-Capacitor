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
		const modSupRowsLength = modSup.length
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
				let modSupRowsIndex = 0
				let prop = scopedDoc
				let propKey
				iterateModSupRows: 
				while(modSupRowsIndex < modSupRowsLength) {
					const modSupRow = modSup[modSupRowsIndex]
					const modSupRowLMNRangeData = lmnRanges.parseRow(modSupRow)
					const anterModSupRow = modSup[modSupRowsIndex + 1]
					if(anterModSupRow === undefined) {
						break iterateModSupRows
					}
					const anterModSupRowLMNRangeData = lmnRanges.parseRow(anterModSupRow)
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
			var modSupRowsIndex = 0
			let prop = collectDoc
			let propKey
			reiterateModSupRows: 
			while(modSupRowsIndex < modSupRowsLength) {
				const modSupRow = modSup[modSupRowsIndex]
				const modSupRowLMNRangeData = lmnRanges.parseRow(modSupRow)
				propKey = modSupRowLMNRangeData.PAT
				if(typeof prop[propKey] !== 'object') break reiterateModSupRows
				prop = prop[propKey]
				modSupRowsIndex++
			}
			prop[propKey] = path.join(modComRowLMNRangeData.PAT)
			collectDocsIndex++
			modComRowsIndex++
		}
		modsIndex++
	}
	return $collect
}

export default assignPropPath