async function saveFileCollect($collect, $models) {
	$collect = Array.from($collect.entries())
	const FileModel = $models.File
	const fileCollect = []
	const fileCollectLength = $collect.length
	var fileCollectIndex = 0
	while(fileCollectIndex < fileCollectLength) {
		const [$fileCollectID, $fileCollect] = $collect[fileCollectIndex]
		var fileDoc = await FileModel.findOneAndUpdate(
			{ 'fs.id': $fileCollectID },
			{ 'content.blocks': $fileCollect },
			{ upsert: true, new: true },
		)
		fileCollect.push(fileDoc.toObject())
		fileCollectIndex++
	}
	return fileCollect
}

export default saveFileCollect