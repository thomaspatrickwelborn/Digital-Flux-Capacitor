async function saveFileCollect($fileCollect, $models) {
	$fileCollect = Array.from($fileCollect.entries())
	const FileModel = $models.File
	const fileCollect = []
	const fileCollectLength = $fileCollect.length
	var fileCollectIndex = 0
	while(fileCollectIndex < fileCollectLength) {
		const [$fileCollectID, $fileCollect] = $fileCollect[fileCollectIndex]
		var fileDoc = await FileModel.findOneAndUpdate(
			{ 'fs.id': $fileCollectID },
			{ 'content.blocks': $fileCollect },
			{ upsert: true, new: true },
		)
		fileCollect.push(fileDoc)
		fileCollectIndex++
	}
	return fileCollect
}

export default saveFileCollect