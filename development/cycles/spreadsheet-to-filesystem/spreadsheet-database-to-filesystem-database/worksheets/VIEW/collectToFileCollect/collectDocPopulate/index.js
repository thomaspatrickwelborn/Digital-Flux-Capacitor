export default async function collectDocPopulate($collectDoc) {
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
