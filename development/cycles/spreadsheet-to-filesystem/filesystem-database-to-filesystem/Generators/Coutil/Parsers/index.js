import Functions from '../Functions/index.js'

const Parsers = {
  // File Parsers
  ESMarkup: ($esMarkup) => {
    let esMarkup = $esMarkup
    .flat()
    .filter(Functions.filterUndefined)
    .join('')
    return esMarkup
  },
  JSONFile: ($jsonFile) => {
    let jsonFile = $jsonFile
    .flat()
    .filter(Functions.filterUndefined)
    .join('')
   return jsonFile
  },
  ESModule: ($esModule) => {
    let esModule = $esModule
    .flat()
    .filter(Functions.filterUndefined)
    .join('')
    return esModule
  },
  // Block Parsers
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
  // Port Parsers
  Imports: ($imports) => {
    let imports = $imports
    .map(Functions.mapImports)
    .filter(Functions.filterUndefined)
    .join('\n')
    return imports
  },
  Exports: ($exports) => {
    let _exports = $exports
    .map(Functions.mapExports)
    .filter(Functions.filterUndefined)
    .join('\n')
    return _exports
  },
  // Statement Parser
  Expression: ($expression, $options) => {
    // let
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
  // Element Parser
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
  // Expression Fragment Parsers
  Ser: ($ser = '', $prespace = '', $anspace = '') => {
    const ser = (
      $ser.length
    ) ? String.prototype.concat(
      $ser, ' '
    ) : $ser
    return ser
  },
  Per: ($per = '', $prespace = '', $anspace = '') => {
    const per = (
      $per.length
    ) ? String.prototype.concat(
      $prespace, $per, $anspace
    ) : $per
    return per
  },
  Ten: ($ten = '', $prespace = '', $anspace = '') => {
    let ten = (
      Functions.isSlug($ten) ||
      $ten.length === 0
    ) ? ''
      : String.prototype.concat(
        $prespace, $ten, $anspace
      )
    return ten
  },
  Inpos: ($inpos = '', $prespace = '', $anspace = '') => {
    let inpos = (
      $inpos.length
    ) ? String.prototype.concat(
      $prespace, $inpos, $anspace
    ) : $inpos
    return inpos
  },
  Expos: ($expos = '', $prespace = '', $anspace = '') => {
    let expos = (
      $expos.length
    ) ? String.prototype.concat(
      $prespace, $expos, $anspace
    ) : $expos
    return expos
  },
  Par: ($par = '', $prespace = '', $anspace = '') => {
    let par = (
      $par.length
    ) ? String.prototype.concat(
      $prespace, $par, $anspace
    ) : $par
  },
}
export default Parsers