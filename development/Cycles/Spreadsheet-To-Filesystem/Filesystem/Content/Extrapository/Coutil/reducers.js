function fsElementContent(
  $updateCollectDoc, $updateCollectDocProperty
) {
  $updateCollectDoc.content = $updateCollectDoc.content || {}
  $updateCollectDoc.content.blocks = $updateCollectDoc.content.blocks || {}
  const [
    $collectDocPropertyKey, $collectDocPropertyVal
  ] = $updateCollectDocProperty
  if(
    $collectDocPropertyKey === 'statement' ||
    $collectDocPropertyKey === 'element' ||
    $collectDocPropertyKey === 'blocks'
  ) {
    $updateCollectDoc.content.blocks[
      $collectDocPropertyKey
    ] = $collectDocPropertyVal
  }
  return $updateCollectDoc
}
function fsElement(
  $updateCollectDoc, $updateCollectDocProperty
) {
  $updateCollectDoc.fs = $updateCollectDoc.fs || {}
  $updateCollectDoc.content = $updateCollectDoc.content || {}
  const [
    $collectDocPropertyKey, $collectDocPropertyVal
  ] = $updateCollectDocProperty
  if(
    $collectDocPropertyKey === 'fs'
  ) {
    $updateCollectDoc.fs = Object.assign(
      $updateCollectDoc.fs, $collectDocPropertyVal
    )
  } else 
  if(
    $collectDocPropertyKey === 'imports' ||
    $collectDocPropertyKey === 'exports'
  ) {
    $updateCollectDoc.content[
      $collectDocPropertyKey
    ] = $collectDocPropertyVal
  }
  return $updateCollectDoc
}
export default {
  fsElementContent,
  fsElement,
}