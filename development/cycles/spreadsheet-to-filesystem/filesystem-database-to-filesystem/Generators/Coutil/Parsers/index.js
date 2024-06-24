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
  ESModule: ($esModule) => {
    let esModule = $esModule
    .flat()
    .filter(Functions.filterUndefined)
    .join('\n')
    return esModule
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
  Imports: ($imports) => {
    let imports = $imports
    .map(Functions.mapImports)
    .filter(Functions.filterUndefined)
    .join('\n')
    return imports
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
  Ser: ($ser) => {
    const ser = (
      $ser
    ) ? String.prototype.concat($ser, ' ')
      : $ser
    return ser
  },
  Per: ($per) => {
    const per = (
      $per
    ) ? String.prototype.concat(' ', $per, ' ')
      : $per
    return per
  },
  Ten: ($ten, $space = '') => {
    let ten = (
      Functions.isSlug($ten)
    ) ? ''
      : String.prototype.concat($ten, $space)
    return ten
  },
}
export default Parsers