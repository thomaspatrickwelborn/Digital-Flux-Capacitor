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
    const { coindex } = $options
    const statement = $statement
    .flat()
    .filter(Functions.filterUndefined)
    statement
    .unshift(Functions.matrizonSpace({
      len: 1,
      char: '\n',
    }, {
      len: coindex.scope, 
      char: '  ',
    }))
    if(coindex.block === coindex.blockLength - 1) {
      statement.push(Functions.matrizonSpace({
        len: 1,
        char: '\n',
      }, {
        len: coindex.scope - 1, 
        char: '  ',
      }))
    }
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