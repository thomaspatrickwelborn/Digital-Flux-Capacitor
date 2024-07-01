export default function updatedDiff($setA, $setB) {
  const updated = []
  const setBLength = $setB.length
  var setBIndex = 0
  while(setBIndex < setBLength) {
    const setBElement = $setB[setBIndex]
    const isSetBElementInSetA = (
      $setA.findIndex(
        ($setAElement) => $setAElement === setBElement
      ) !== -1
    ) ? true
      : false
    if(isSetBElementInSetA === true) updated.push(setBElement)
    setBIndex++
  }
  return updated
}
