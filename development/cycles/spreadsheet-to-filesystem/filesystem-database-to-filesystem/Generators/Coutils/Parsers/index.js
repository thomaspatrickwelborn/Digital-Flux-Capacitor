import Operators from '../Operators/index.js'
const isSlug = function($ten) { return (
  typeof $ten === 'string' &&
  $ten.slice(0, 2) === Operators.tenSlug
) }
const Parsers = {
  JSONFile: ($jsonFile) => JSON.stringify(
    JSON.parse(
     $jsonFile
     .join('')
  ), null, 2),
  Blocks: ($blocks) => $blocks
  .flat()
  .filter(($expressionFrag) => $expressionFrag),
  Block: ($block) => $block
  .flat()
  .filter(($expressionFrag) => $expressionFrag)
  .join(''),
  Statement: ($statement) => $statement
  .flat()
  .filter(($expressionFrag) => $expressionFrag),
  Element: ($element) => $statement
  .flat()
  .filter(($expressionFrag) => $expressionFrag),
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