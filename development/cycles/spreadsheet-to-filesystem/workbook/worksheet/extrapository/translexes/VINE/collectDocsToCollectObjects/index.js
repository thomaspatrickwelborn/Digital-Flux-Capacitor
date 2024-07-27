function collectDocsToCollectObjects($collect, $worksheet) {
  const collectLength = $collect.length
  var collectIndex = 0
  while(collectIndex < collectLength) {
    const collectDoc = $collect[collectIndex]
    $collect[collectIndex] = collectDoc.toObject({
      flattenObjectIds: true,
      versionKey: false,
    })
    collectIndex++
  }
  return $collect
}
export default collectDocsToCollectObjects