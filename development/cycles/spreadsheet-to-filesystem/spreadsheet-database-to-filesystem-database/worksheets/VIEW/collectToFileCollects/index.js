async function collectDocPopulate($collectDoc) {
  await $collectDoc.populate({
    path: 'blocks',
  })
  const collectDocBlocks = $collectDoc.blocks
  if(collectDocBlocks.length === 0) return $collectDoc
  const collectDocBlocksLength = collectDocBlocks.length
  var collectDocBlocksIndex = 0
  while(collectDocBlocksIndex < collectDocBlocksLength) {
    var collectDocBlock = collectDocBlocks[collectDocBlocksIndex]
    collectDocBlock = await collectDocPopulate(collectDocBlock)
    collectDocBlocksIndex++
  }
  return $collectDoc
}

async function collectToFileCollects($collect, $settings) {
  const { worksheet, lmnRanges } = $settings
  const worksheetMods = Array.from(worksheet.mods.values())
  const worksheetModsLength = worksheetMods.length
  var worksheetModsIndex = 0
  const collectDocs = []
  var collectDocsIndex = 0
  iterateWorksheetModsIndex: while(worksheetModsIndex < worksheetModsLength) {
    const { nom, sup, com } = worksheetMods[worksheetModsIndex]
    const comRowsLength = com.length
    var comRowsIndex = 0
    iterateComRows: while(comRowsIndex < comRowsLength) {
      var collectDoc = $collect[collectDocsIndex]
      collectDoc = await collectDocPopulate(collectDoc)
      if(collectDoc.fs.id === undefined) {
        collectDoc.fs.id = $collect[collectDocsIndex - 1].fs.id
        collectDoc.fs.path = $collect[collectDocsIndex - 1].fs.path
      }
      const comRow = com[comRowsIndex]
      const comRowLMNRangeData = rowLMNRangeFromLMNRanges(comRow, lmnRanges)
      const comRowLMNRangeIndex = comRowLMNRangeData.rowLMNRangeIndex
      const comRowLMNRange = comRowLMNRangeData.rowLMNRange
      if(comRowLMNRange === undefined) {
        comRowsIndex++
        continue iterateComRows
      }
      if(comRowLMNRangeIndex === 0) {
        collectDocs.push(collectDoc)
      }
      collectDocsIndex++
      comRowsIndex++
    }
    worksheetModsIndex++
  }
  const files = new Map()
  const collectDocsLength = collectDocs.length
  collectDocsIndex = 0
  while(collectDocsIndex < collectDocsLength) {
    const collectDoc = collectDocs[collectDocsIndex]
    if(files.has(collectDoc.fs.id) === false) {
      files.set(collectDoc.fs.id, [])
    }
    files.get(collectDoc.fs.id).push(collectDoc.toObject({
      minimize: true,
    }))
    collectDocsIndex++
  }
  return files
}

export default collectToFileCollects