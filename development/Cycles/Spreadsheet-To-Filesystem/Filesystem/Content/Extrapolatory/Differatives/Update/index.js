export default function Update($setA, $setB) {
  const updated = []
  const setBLength = $setB.length
  var setBIndex = 0
  while(setBIndex < setBLength) {
    const setBElement = $setB[setBIndex]
    const isSetBElementInSetA = $setA.includes(setBElement)
    if(isSetBElementInSetA === true) updated.push(setBElement)
    setBIndex++
  }
  return updated
}