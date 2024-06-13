async function saveFileCollect($fileCollect, $worksheet, $models) {
  const collectEntries = Array.from($fileCollect.entries())
  const FileModel = $models.File
  const fileCollect = []
  const fileCollectLength = collectEntries.length
  var fileCollectIndex = 0
  while(fileCollectIndex < fileCollectLength) {
    const [$fileCollectID, $fileCollect] = collectEntries[fileCollectIndex]
    var fileDoc = await FileModel.findOneAndUpdate(
      { 'fs.id': $fileCollectID },
      {
        'blocks': $fileCollect.blocks,
      },
      { upsert: true, new: true },
    )
    fileCollect.push(fileDoc/*.toObject()*/)
    fileCollectIndex++
  }
  return fileCollect
}

export default saveFileCollect