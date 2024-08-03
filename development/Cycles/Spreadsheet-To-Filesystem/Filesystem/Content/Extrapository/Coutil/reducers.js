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
const fsContentBlockPropertyKeys = [
  'element', 'statement', 'blocks'
]

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
    if($collectDocPropertyKey !== 'fs') {
      $updateCollectDoc.content = $updateCollectDoc.content || {}
      if(
        fsContentBlockPropertyKeys.includes(
          $collectDocPropertyKey
        ) === true
      ) {
        $updateCollectDoc.content.blocks = $updateCollectDoc.content.blocks || [{}]
        Object.assign(
          $updateCollectDoc.content.blocks[0],
          {
            [$collectDocPropertyKey]: $collectDocPropertyVal
          }
        )
      } else {
        $updateCollectDoc.content[
          $collectDocPropertyKey
        ] = $collectDocPropertyVal
      }
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