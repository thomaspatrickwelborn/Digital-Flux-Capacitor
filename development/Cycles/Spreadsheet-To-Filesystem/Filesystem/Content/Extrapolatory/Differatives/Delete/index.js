export default function Delete($setA, $setB) {
  const deleted = []
  const setALength = $setA.length
  var setAIndex = 0
  while(setAIndex < setALength) {
    const setAElement = $setA[setAIndex]
    const isSetAElementInSetB = $setB.includes(setAElement)
    if(isSetAElementInSetB === false) deleted.push(setAElement)
    setAIndex++
  }
  return deleted
}