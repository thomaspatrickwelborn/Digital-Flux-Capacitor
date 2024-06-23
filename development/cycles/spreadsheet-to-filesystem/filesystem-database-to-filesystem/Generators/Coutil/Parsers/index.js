import Functions from '../Functions/index.js'

const Parsers = {
  ESMarkup: ($esMarkup) => {
    let esMarkup = $esMarkup
    .flat()
    .filter(Functions.filterUndefined)
    .join('\n')
    return esMarkup
  },
  JSONFile: ($jsonFile) => {
    let jsonFile = $jsonFile
    .flat()
    .filter(Functions.filterUndefined)
    .join('\n')
   return jsonFile
  },
  Blocks: ($blocks) => {
    let blocks = $blocks
    .flat()
    .filter(Functions.filterUndefined)
    return blocks
  },
  Block: ($block) => {
    let block = $block
    .flat()
    .filter(Functions.filterUndefined)
    .join('')
    return block
  },
  Statement: ($statement, $options) => {
    const { coindex, space } = $options
    const { horizon, verizon } = space
    const statement = $statement
    .flat()
    .filter(Functions.filterUndefined)
    statement
    .unshift(Functions.matrizonSpace({
      len: 1,
      char: verizon.char,
    }, {
      len: coindex.scope, 
      char: horizon.char,
    }))
    if(coindex.block === coindex.blockLength - 1) {
      statement.push(Functions.matrizonSpace({
        len: 1,
        char: verizon.char,
      }, {
        len: coindex.scope - 1, 
        char: horizon.char,
      }))
    }
    return statement
  },
  Element: ($element, $options) => {
    const { coindex, space } = $options
    const { horizon, verizon } = space
    const element = $element
    .flat()
    .filter(Functions.filterUndefined)
    element
    .unshift(Functions.matrizonSpace({
      len: 1,
      char: verizon.char,
    }, {
      len: coindex.scope, 
      char: horizon.char,
    }))
    if(coindex.block === coindex.blockLength - 1) {
      element.push(Functions.matrizonSpace({
        len: 1,
        char: verizon.char,
      }, {
        len: coindex.scope - 1, 
        char: horizon.char,
      }))
    }
    return element
  },
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