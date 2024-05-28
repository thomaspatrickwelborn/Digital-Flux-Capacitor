const Translexes = []

async function Collect($settings) {
	var collect = []
	const {
		mods, composits, dbConnection, lmnRanges
	} = $settings
	const modsLength = mods.length
	var modsIndex = 0
	while(modsIndex < modsLength) {
		const {
			nom, sup, com
		} = mods[modsIndex][1]
		const [
			$compositIndex, $composit
		] = composits[modsIndex]
		const Model = dbConnection.models[nom]
		const collectRows = $composit
		const collectRowsLength = collectRows.length
		var collectRowsIndex = 0
		while(collectRowsIndex < collectRowsLength) {
			const collectRow = collectRows[collectRowsIndex]
			const collectDoc = await new Model(collectRow)
			collect.push(await collectDoc.save())
			collectRowsIndex++
		}
		modsIndex++
	}
	const translexes = Translexes
	const translexesLength = translexes.length
	var translexesIndex = 0
	while(translexesIndex < translexesLength) {
		const [$translexisName, $translexisMethod] = translexes[translexesIndex]
		const translexisMethodType = $translexisMethod.constructor.name
		switch(translexisMethodType) {
			case 'Function':
				collect = $translexisMethod(collect, {
					mods: mods, lmnRanges, composits
				})
				break
			case 'AsyncFunction':
				collect = await $translexisMethod(collect, {
					mods: mods, lmnRanges, composits
				})
				break
		}
		translexesIndex++
	}
	const collectDocsLength = collect.length
	var collectDocsIndex = 0
	while(collectDocsIndex < collectDocsLength) {
		var collectDoc = await collect[collectDocsIndex]
		.save({
			validateBeforeSave: false,
		})
		collectDocsIndex++
	}
	return collect
}

export default Collect