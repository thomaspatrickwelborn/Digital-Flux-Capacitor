export default function AddedDiff($setA, $setB) {
  const added = []
  const setBLength = $setB.length
  var setBIndex = 0
  while(setBIndex < setBLength) {
    const setBElement = $setB[setBIndex]
    const isSetBElementInSetA = (
      $setA.findIndex(
        ($setBElement) => $setBElement === setBElement
      ) !== -1
    ) ? true
      : false
    if(isSetBElementInSetA === false) added.push(setBElement)
    setBIndex++
  }
  return added
}
