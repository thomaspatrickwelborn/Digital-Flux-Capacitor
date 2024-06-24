import Operators from '../Operators/index.js'
const zonSettings = {
  len: undefined, 
  char: undefined,
}
const isSlug = function($ten) { return (
  typeof $ten === 'string' &&
  $ten.slice(0, 2) === Operators.tenSlug
) }
const filterUndefined = ($expressionFrag) => $expressionFrag
const zonSpace = ($horizon, $space) => {
  let zonSpaceIndex = 0
  let _zonSpace = ''
  iterateHorizonSpaceIndex: 
  while(zonSpaceIndex <= $horizon) {
    if(zonSpaceIndex === 0) {
      zonSpaceIndex++
      continue iterateHorizonSpaceIndex
    }
    _zonSpace = _zonSpace.concat($space)
    zonSpaceIndex++
  }
  return _zonSpace
}
const matrizonSpace = ($zoneA, $zoneB) => {
  const zoneASpace = zonSpace($zoneA.len, $zoneA.char)
  const zoneBSpace = zonSpace($zoneB.len, $zoneB.char) 
  return String.prototype.concat(
    zoneASpace, zoneBSpace
  )
}
const mapImports = ($import) => {
  return $import.join('')
}
const Functions = {
  filterUndefined,
  matrizonSpace,
  isSlug,
  mapImports,
}
export default Functions