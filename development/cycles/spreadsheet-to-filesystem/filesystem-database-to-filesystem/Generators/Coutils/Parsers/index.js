import Functions from '../Functions/index.js'
const Parsers = {
  JSONFile: ($jsonFile) => {
    let jsonFile = $jsonFile
   .join('')
   return jsonFile
  },
  Blocks: ($blocks) => $blocks
  .flat()
  .filter(Functions.filterUndefined),
  Block: ($block) => {
    let block = $block
    .flat()
    .filter(Functions.filterUndefined)
    .join('')
    return block
  },
  Statement: ($statement, $options) => {
    console.log($options.coindex)
    const matrizonSpace = Functions.matrizonSpace({
      len: $options.coindex.scope, 
      char: '  ',
    }, {
      len: 1,
      char: '\n',
    })
    const statement = $statement
    .flat()
    .filter(Functions.filterUndefined)
    statement
    .unshift(matrizonSpace)
    return statement
  },
  Element: ($element) => $statement
  .flat()
  .filter(Functions.filterUndefined),
  Per: ($per) => (
    $per
  ) ? String.prototype.concat(' ', $per, ' ')
    : $per,
  Ten: ($ten) => (
    Functions.isSlug($ten)
  ) ? ''
    : $ten,
}
export default Parsers