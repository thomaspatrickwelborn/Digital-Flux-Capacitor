const ignorePropertyKeys = [
  '$__', '_doc', '$errors', '$isNew', 
  '_id', '__v'
]
const fsIgnorePropertyKeys = ignorePropertyKeys
.concat([
  'portal', 'fsElements'
])
const fsContentIgnorePropertyKeys = ignorePropertyKeys
.concat([
  // 
])

function fsElementContent(
  $updateCollectDoc, $updateCollectDocProperty
) {
  const [
    $collectDocPropertyKey, $collectDocPropertyVal
  ] = $updateCollectDocProperty
  if(
    fsContentIgnorePropertyKeys.includes(
      $collectDocPropertyKey
    ) === false
  ) {
    if($collectDocPropertyKey === 'fs') {
      $updateCollectDoc[
        $collectDocPropertyKey
      ] = $collectDocPropertyVal
    } else
    if($collectDocPropertyKey !== 'fs') {
      $updateCollectDoc.content = $updateCollectDoc.content || {}
      $updateCollectDoc.content[
        $collectDocPropertyKey
      ] = $collectDocPropertyVal
    }
  }
  return $updateCollectDoc
}
function fsElement(
  $updateCollectDoc, $updateCollectDocProperty
) {
  const [
    $collectDocPropertyKey, $collectDocPropertyVal
  ] = $updateCollectDocProperty
  if(
    fsIgnorePropertyKeys.includes(
      $collectDocPropertyKey
    ) === false
  ) {
    if($collectDocPropertyKey === 'fs') {
      $updateCollectDoc[
        $collectDocPropertyKey
      ] = $collectDocPropertyVal
    }
  }
  return $updateCollectDoc
}
export default {
  fsElementContent,
  fsElement,
}