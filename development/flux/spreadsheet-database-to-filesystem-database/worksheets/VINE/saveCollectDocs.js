async function saveCollectDocs($collect, $models) {
	const { File, Fold } = $models
	const collectDocs = []
	const collectDocsLength = $collect.length
	var collectDocsIndex = 0
	while(collectDocsIndex < collectDocsLength) {
		const collectDoc = $collect[collectDocsIndex]
		var fsDoc
		switch(collectDoc.fs.type) {
			case 'File':
				fsDoc = await File.findOneAndUpdate(
					{ 'fs.id': collectDoc.fs.id },
					collectDoc,
					{ upsert: true, new: true }
				)
				break
			case 'Fold':
				fsDoc = await Fold.findOneAndUpdate(
					{ 'fs.id': collectDoc.fs.id },
					collectDoc,
					{ upsert: true, new: true }
				)
				break
		}
		collectDocs.push(fsDoc)
		collectDocsIndex++
	}
	return collectDocs
}

export default saveCollectDocs