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
const matrizonSpace = (
  $horizon = ZonSettings, 
  $verizon = ZonSettings
) => {
  const horizonSpace = zonSpace($horizon.len, $horizon.char)
  const verizonSpace = zonSpace($verizon.len, $verizon.char) 
  return String.prototype.concat(
    verizonSpace, horizonSpace
  )
}
const Functions = {
  filterUndefined,
  matrizonSpace,
  isSlug,
}
export default Functions