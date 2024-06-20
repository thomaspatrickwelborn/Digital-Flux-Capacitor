import populateOptions from '../../../coutil/populateOptions.js'
async function collectToFileCollect($collect, $worksheet) {
  const lmnRanges = $worksheet.depository.lmnRanges
  const worksheetMods = Array.from($worksheet.depository.mods.values())
  const worksheetModsLength = worksheetMods.length
  var worksheetModsIndex = 0
  const collectDocs = []
  var collectDocsIndex = 0
  iterateWorksheetMods: 
  while(worksheetModsIndex < worksheetModsLength) {
    const { nom, sup, com } = worksheetMods[worksheetModsIndex]
    const comRowsLength = com.length
    var comRowsIndex = 0
    iterateComRows:
    while(comRowsIndex < comRowsLength) {
      let collectDoc = $collect[collectDocsIndex]
      delete collectDoc._id
      delete collectDoc.__v
      if(collectDoc.fs.id === undefined) {
        collectDoc.fs.id = $collect[collectDocsIndex - 1].fs.id
        collectDoc.fs.path = $collect[collectDocsIndex - 1].fs.path
      }
      if(collectDoc?.element?.attribute !== undefined) {
        collectDoc.element.attributes = collectDoc.element.attributes || []
        collectDoc.element.attributes.push(
          collectDoc.element.attribute//.toObject()
        )
        delete collectDoc.element.attribute
      }
      if(collectDoc?.element?.text !== undefined) {
        collectDoc.element.texts = collectDoc.element.texts || []
        collectDoc.element.texts.push(
          collectDoc.element.text//.toObject()
        )
        delete collectDoc.element.text
      }
      await collectDoc.save()
      const comRow = com[comRowsIndex]
      const comRowLMNRange = lmnRanges.parseRow(comRow)
      if(comRowLMNRange.DEX === 0) {
        const collectDocPopulateOptions = populateOptions(
          lmnRanges.WIDTH, collectDoc.fs.populatePaths
        )
        collectDoc = await collectDoc.populate(collectDocPopulateOptions)
        collectDoc = collectDoc.toObject({ minimize: true, id: false, _id: false })
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
  reiterateCollectDocs: 
  while(collectDocsIndex < collectDocsLength) {
    const collectDoc = collectDocs[collectDocsIndex]
    if(files.has(collectDoc.fs.id) === false) {
      files.set(collectDoc.fs.id, [])
    }
    files.get(collectDoc.fs.id).push(collectDoc)
    collectDocsIndex++
  }
  return files
}

export default collectToFileCollect