export default function populateOptions($depth, $path, $options = {
    strictPopulate: false,
}) {
  let populateDepthIndex = 0
  iteratePopulateDepth:
  while(populateDepthIndex < $depth) {
    Object.assign($options, {
      path: $path,
    })
    if(populateDepthIndex < $depth - 2) {
      $options.populate = {}
      $options = $options.populate
    }
    populateDepthIndex++
  }
  return populateOptions
}