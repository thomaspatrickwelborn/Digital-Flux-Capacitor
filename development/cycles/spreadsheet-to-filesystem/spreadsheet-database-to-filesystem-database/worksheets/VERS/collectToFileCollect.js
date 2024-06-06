async function collectToFileCollect($collect, $worksheet) {
	const worksheetLMNRange = $worksheet.ranges.find(
		($range) => $range.Name.match(/^LMN/)
	)
	const worksheetMods = Array.from($worksheet.mods.values())
	const worksheetModsLength = worksheetMods.length
	var worksheetModsIndex = 0
	const collectDocs = []
	var collectDocsIndex = 0
	while(worksheetModsIndex < worksheetModsLength) {
		const { nom, sup, com } = worksheetMods[worksheetModsIndex]
		const comRowsLength = com.length
		var comRowsIndex = 0
		while(comRowsIndex < comRowsLength) {
			const collectDoc = $collect[collectDocsIndex]
			if(collectDoc.fs.id === undefined) {
				collectDoc.fs.id = $collect[collectDocsIndex - 1].fs.id
				collectDoc.fs.path = $collect[collectDocsIndex - 1].fs.path
			}
			delete collectDoc._id
			delete collectDoc.__v
			delete collectDoc.supset
			const comRow = com[comRowsIndex]
			const comRowLMNRange = comRow.slice(
				worksheetLMNRange.Ref.s.c, worksheetLMNRange.Ref.s.c + 1
			)
			const comRowLMNRangeNameIndex = comRowLMNRange.findIndex(
				($comRowLMNRangeCell) => $comRowLMNRangeCell !== undefined
			)
			if(comRowLMNRangeNameIndex === 0) {
				console.log('collectDoc', collectDoc)
				await collectDoc.populate({
					path: 'blocks',
					strictPopulate: false,
					populate: {
						path: 'blocks',
						strictPopulate: false,
					}
				})
				collectDocs.push(collectDoc.toObject({
					minimize: false,
				}))
			}
			collectDocsIndex++
			comRowsIndex++
		}
		worksheetModsIndex++
	}
	const files = new Map()
	const collectDocsLength = collectDocs.length
	collectDocsIndex = 0
	while(collectDocsIndex < collectDocsLength) {
		const collectDoc = collectDocs[collectDocsIndex]
		if(files.has(collectDoc.fs.id) === false) {
			files.set(collectDoc.fs.id, [])
		}
		files.get(collectDoc.fs.id).push(collectDoc)
		collectDocsIndex++
	}
	const filesValues = Array.from(files.values())
	const filesValuesLength = filesValues.length
	var filesValuesIndex = 0
	while(filesValuesIndex < filesValuesLength) {
		const fileBlocks = filesValues[filesValuesIndex]
		var fileBlocksLength = fileBlocks.length 
		var fileBlocksIndex = 0
		while(fileBlocksIndex < fileBlocksLength) {
			const fileBlock = fileBlocks[fileBlocksIndex]
			if(
				fileBlocksIndex === 0 &&
				fileBlock.statement.lexter.ser === 'import'
			) {
				fileBlocks.shift()
				fileBlocksLength = fileBlocks.length
				continue
			} else if(
				fileBlocksIndex === fileBlocksLength - 1 &&
				fileBlock.statement.lexter.ser === 'export'
			) {
				fileBlocks.pop()
				fileBlocksLength = fileBlocks.length
				continue
			}
			fileBlocksIndex++
		}
		filesValuesIndex++
	}
	return files
}

export default collectToFileCollect