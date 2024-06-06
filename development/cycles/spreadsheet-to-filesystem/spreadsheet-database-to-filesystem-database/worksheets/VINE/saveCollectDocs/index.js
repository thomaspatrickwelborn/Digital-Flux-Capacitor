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
				fsDoc = await new File(collectDoc)
				break
			case 'Fold':
				fsDoc = await new Fold(collectDoc)
				break
		}
		fsDoc = await fsDoc.save()
		collectDocs.push(fsDoc/*.toObject()*/)
		collectDocsIndex++
	}
	return collectDocs
}

export default saveCollectDocs