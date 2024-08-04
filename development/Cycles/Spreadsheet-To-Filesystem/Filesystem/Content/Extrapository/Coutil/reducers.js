import deepmerge from 'deepmerge'
const Keys = {
  FSElement: {
    include: [
      'fs', 'imports', 'exports'
    ],
    get exclude() { return Keys.exclude.concat([
      'portal', 'fsElements'
    ]) }
  },
  FSElementContent: {
    include: [
      'element', 'statement', 'blocks'
    ],
    get exclude() { return Keys.exclude.concat([
      'fs'
    ]) },
  },
  exclude: [
    '$__', '_doc', '$errors', '$isNew', 
    '_id', '__v', 'id'
  ], 
}
function fsElementContent(
  $updateCollectDoc, $updateCollectDocProperty
) {
  const [
    $collectDocPropertyKey, $collectDocPropertyVal
  ] = $updateCollectDocProperty
  if(
    Keys.FSElementContent.exclude.includes(
      $collectDocPropertyKey
    ) === false
  ) {
    console.log($collectDocPropertyKey, $collectDocPropertyVal)
    $updateCollectDoc.content = $updateCollectDoc.content || {}
    if(
      Keys.FSElementContent.include.includes(
        $collectDocPropertyKey
      ) === true
    ) {
      $updateCollectDoc = deepmerge(
        $updateCollectDoc,
        {
          content: {
            [$collectDocPropertyKey]: $collectDocPropertyVal
          }
        }
      )
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
    Keys.FSElement.exclude.includes(
      $collectDocPropertyKey
    ) === false
  ) {
    console.log($collectDocPropertyKey, $collectDocPropertyVal)
    if($collectDocPropertyKey === 'fs') {
      $updateCollectDoc.fs = $updateCollectDoc.fs || {}
      $updateCollectDoc = deepmerge(
        $updateCollectDoc, 
        {
          [$collectDocPropertyKey]: $collectDocPropertyVal
        }
      )
    } else {
      $updateCollectDoc.content = $updateCollectDoc.content || {}
      $updateCollectDoc = deepmerge(
        $updateCollectDoc, 
        {
          content: {
            [$collectDocPropertyKey]: $collectDocPropertyVal
          }
        }
      )  
    }
  }
  return $updateCollectDoc
}
export default {
  fsElementContent,
  fsElement,
}