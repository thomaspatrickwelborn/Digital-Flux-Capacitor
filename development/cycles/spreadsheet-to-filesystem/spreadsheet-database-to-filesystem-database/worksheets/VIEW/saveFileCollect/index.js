async function saveFileCollect($fileCollect, $models) {
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
        'content.blocks': $fileCollect.content.blocks,
      },
      { upsert: true, new: true },
    )
    await fileDoc.populate({
      path: 'content.blocks',
      strictPopulate: false,
      populate: {
        path: 'content.blocks',
        strictPopulate: false,
      }
    })
    fileCollect.push(fileDoc.toObject())
    fileCollectIndex++
  }
  return fileCollect
}

export default saveFileCollect