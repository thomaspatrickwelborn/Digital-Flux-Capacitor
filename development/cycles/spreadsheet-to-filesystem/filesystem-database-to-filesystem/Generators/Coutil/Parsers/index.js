import Functions from '../Functions/index.js'

const Parsers = {
  // Space Parser
  SpaceInsert: (
    $string = '', $prespace = '', $antspace = ''
  ) => {
    return String.prototype.concat(
      $prespace, $string, $antspace
    )
  },
  Space: ($char = '', $length = 0) => {
    let space = []
    space.length = $length
    space = space
    .fill('  ', 0, $length)
    .join('')
    return space
  },
  // File Parsers
  ESMarkup: ($esMarkup) => {
    let esMarkup = $esMarkup
    .flat()
    .join('')
    return esMarkup
  },
  JSONFile: ($jsonFile) => {
    let jsonFile = $jsonFile
    .flat()
    .join('')
   return jsonFile
  },
  ESModule: ($esModule) => {
    let esModule = $esModule
    .flat()
    .join('')
    return esModule
  },
  // Block Parsers
  Blocks: ($blocks = [], $options = {}) => {
  const { coindex } = $options
  let blocks = $blocks
  .map((
      $block, $blockIndex
    ) => {
      const prespace = Parsers.Space(
        '  ', coindex.scope + 1
      )
      if(prespace.length) {
        $block.unshift(prespace)
      }
      if($blockIndex < $blocks.length - 1) {
        $block.push('\n')
      }
      return $block
    })
    .flat()
    .join('')
    return blocks
  },
  Block: ($block) => {
    let block = $block
    .flat()
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
  Statement: ($statement) => {
    return $statement
    .flat()
  },
  // Element Parser
  Element: ($element, $options) => {
    return $element
    .flat()
  },
  // Expression Fragment Parsers
  Ser: ($ser = '', $prespace = '', $anspace = '') => {
    const ser = (
      $ser.length
    ) ? String.prototype.concat(
      $prespace, $ser, $anspace
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
    return par
  },
}
export default Parsers