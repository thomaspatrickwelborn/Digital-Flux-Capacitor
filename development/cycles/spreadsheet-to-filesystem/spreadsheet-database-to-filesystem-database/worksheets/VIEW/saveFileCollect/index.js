async function saveFileCollect($fileCollects, $models) {
  const collectEntries = Array.from($fileCollects.entries())
  const FileModel = $models.File
  const fileCollects = []
  const fileCollectsLength = collectEntries.length
  var fileCollectsIndex = 0
  while(fileCollectsIndex < fileCollectsLength) {
    const [$fileCollectID, $fileCollect] = collectEntries[fileCollectsIndex]
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
    fileCollects.push(fileDoc.toObject())
    fileCollectsIndex++
  }
  return fileCollects
}

export default saveFileCollect