async function saveCollectDocs($collect, $models) {
	const { File } = $models
	const collect = []
	const collectDocsLength = $collect.length
	var collectDocsIndex = 0
	while(collectDocsIndex < collectDocsLength) {
		const collectDoc = $collect[collectDocsIndex]
		var fileDoc = await File.findOneAndUpdate(
			{ 'fs.id': collectDoc.fs.id },
			{ data: collectDoc.data },
			{ upsert: true, new: true },
		)
		collect.push(fileDoc)
		collectDocsIndex++
	}
	return collect
}

export default saveCollectDocs