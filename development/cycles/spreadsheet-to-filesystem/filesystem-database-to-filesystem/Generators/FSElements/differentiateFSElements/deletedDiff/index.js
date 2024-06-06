export default function deletedDiff($setA, $setB) {
  const deleted = []
  const setALength = $setA.length
  var setAIndex = 0
  while(setAIndex < setALength) {
    const setAElement = $setA[setAIndex]
    const isSetAElementInSetB = (
      $setB.findIndex(
        ($setBElement) => $setBElement === setAElement
      ) !== -1
    ) ? true
      : false
    if(isSetAElementInSetB === false) deleted.push(setAElement)
    setAIndex++
  }
  return deleted
}