async function saveFileCollect($fileCollects, $models) {
	$fileCollects = Array.from($fileCollects.entries())
	const FileModel = $models.File
	const fileCollects = []
	const fileCollectsLength = $fileCollects.length
	var fileCollectsIndex = 0
	while(fileCollectsIndex < fileCollectsLength) {
		const [$fileCollectID, $fileCollect] = $fileCollects[fileCollectsIndex]
		var fileDoc = await FileModel.findOneAndUpdate(
			{ 'fs.id': $fileCollectID },
			{ 'data.blocks': $fileCollect },
			{ upsert: true, new: true },
		)
		fileCollects.push(fileDoc)
		fileCollectsIndex++
	}
	return fileCollects
}

export default saveFileCollect