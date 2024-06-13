export default function blocksPopulateOptions($worksheet) {
  const blocksPopulateDepth = $worksheet.depository.lmnRanges.WIDTH
  const blocksPopulateOptions = {}
  let blocksPopulateOptionsProps = blocksPopulateOptions
  let blocksPopulateDepthIndex = 0
  iterateCollectDocBlocksPopulateDepth:
  while(blocksPopulateDepthIndex < blocksPopulateDepth) {
    Object.assign(blocksPopulateOptionsProps, {
      path: 'blocks',
      strictPopulate: false,
    })
    if(blocksPopulateDepthIndex < blocksPopulateDepth - 2) {
      blocksPopulateOptionsProps.populate = {}
      blocksPopulateOptionsProps = blocksPopulateOptionsProps.populate
    }
    blocksPopulateDepthIndex++
  }
  return blocksPopulateOptions
}