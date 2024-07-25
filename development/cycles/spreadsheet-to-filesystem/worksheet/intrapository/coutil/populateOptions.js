export default function populateOptions(
  $depth, $paths = []
) {
  const _populateOptionsArray = []
  iteratePaths: 
  for(const $path of $paths) {
    const _populateOptions = {}
    let populateOptionsScope = _populateOptions
    let populateDepthIndex = 0
    iteratePopulateDepth:
    while(populateDepthIndex < $depth) {
      Object.assign(populateOptionsScope, {
        path: $path,
        strictPopulate: false,
      })
      if(populateDepthIndex < $depth - 2) {
        populateOptionsScope.populate = {}
        populateOptionsScope = populateOptionsScope.populate
      }
      populateDepthIndex++
    }
    _populateOptionsArray.push(_populateOptions)
  }
  return _populateOptionsArray
}