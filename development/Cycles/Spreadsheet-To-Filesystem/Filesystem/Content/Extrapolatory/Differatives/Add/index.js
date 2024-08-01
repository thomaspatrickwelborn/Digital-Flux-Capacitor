export default function Add($setA, $setB) {
  const added = []
  const setBLength = $setB.length
  var setBIndex = 0
  while(setBIndex < setBLength) {
    const setBElement = $setB[setBIndex]
    const isSetBElementInSetA = $setA.includes(setBElement)
    if(isSetBElementInSetA === false) {
      added.push(setBElement)
    }
    setBIndex++
  }
  return added
}