import Operators from '../Operators/index.js'
const isSlug = function($ten) { return (
  typeof $ten === 'string' &&
  $ten.slice(0, 2) === Operators.tenSlug
) }
const filterUndefined = ($expressionFrag) => $expressionFrag
const Parsers = {
  JSONFile: ($jsonFile) => {
    let jsonFile = $jsonFile
   .join('')
   return jsonFile
  },
  Blocks: ($blocks) => $blocks
  .flat()
  .filter(filterUndefined),
  Block: ($block) => {
    let block = $block
    .flat()
    .filter(filterUndefined)
    .join('')
    return block
  },
  Statement: ($statement) => {
    const statement = $statement
    .flat()
    .filter(filterUndefined)
    return statement
  },
  Element: ($element) => $statement
  .flat()
  .filter(filterUndefined),
  Per: ($per) => (
    $per
  ) ? String.prototype.concat(' ', $per, ' ')
    : $per,
  Ten: ($ten) => (
    isSlug($ten)
  ) ? ''
    : $ten,
}
export default Parsers