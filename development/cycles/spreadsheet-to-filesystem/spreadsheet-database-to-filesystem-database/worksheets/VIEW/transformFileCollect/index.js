function transformFileCollect($collect, $worksheet) {
  const collectEntries = Array.from($collect.entries())
  const collectEntriesLength = collectEntries.length
  var collectEntriesIndex = 0
  while(collectEntriesIndex < collectEntriesLength) {
    const [
      $fsID,
      $collectEntry,
    ] = collectEntries[collectEntriesIndex]
    const fileFS = {
      id: undefined,
      path: undefined,
    }
    const content = {
      blocks: []
    }
    const file = {
      fs: fileFS,
      content: content,
    }
    const collectDocLength = $collectEntry.length
    var collectDocIndex = 0
    while(collectDocIndex < collectDocLength) {
      const collectDoc = $collectEntry[collectDocIndex]
      if(fileFS.id === undefined) fileFS.id = collectDoc.fs.id
      if(fileFS.path === undefined) fileFS.path = collectDoc.fs.path
      delete collectDoc._id
      delete collectDoc.__v
      delete collectDoc.fs
      content.blocks.push(collectDoc)
      collectDocIndex++
    }
    $collect.set($fsID, file)
    collectEntriesIndex++
  }
  return $collect
}

export default transformFileCollect