function collectsFromCollect($collect) {
	const collects = {}
	const collectDocsLength = $collect.length
	var collectDocsIndex = 0
	while(collectDocsIndex < collectDocsLength) {
		var collectDoc = $collect[collectDocsIndex]
		const collectName = collectDoc.collection.collectionName
		collectDoc = collectDoc.toObject()
		delete collectDoc.__v
		delete collectDoc._id
		collects[collectName] = collects[collectName] || []
		collects[collectName].push(collectDoc)
		collectDocsIndex++
	}
	return collects
}

export default collectsFromCollect