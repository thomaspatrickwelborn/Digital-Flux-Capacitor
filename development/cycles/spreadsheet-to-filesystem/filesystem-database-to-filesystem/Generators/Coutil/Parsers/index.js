import Functions from '../Functions/index.js'
const Parsers = {
  Indent($coindex) {
    const { scope } = $coindex
    const preter = Parsers.LineIndent(
      '  ', (scope - 1)
    )
    const meter = Parsers.LineIndent(
      '  ', (scope)
    )
    const anter = Parsers.LineIndent(
      '  ', (scope + 1)
    )
    const preterScope = Parsers.NewLineIndent(
      '  ', (scope - 1)
    )
    const meterScope = Parsers.NewLineIndent(
      '  ', scope
    )
    const anterScope = Parsers.NewLineIndent(
      '  ', scope + 1
    )
    return {
      preter, meter, anter,
      preterScope, meterScope, anterScope,
    }
  },
  SpaceChar: ' ',
  IndentChar: '  ',
  LineIndent: ($indentChar, $scope) => Parsers.Space(
    $indentChar || Parsers.IndentChar, $scope || 0
  ),
  NewLineIndent: ($indentChar, $scope) => [
    '\n', Parsers.LineIndent(
      $indentChar || Parsers.IndentChar, $scope || 0
    ),
  ].join(''),
  SpaceInsert: (
    $val = '', $prespace = '', $anspace = ''
  ) => {
    if(!$val) return $val
    if(Array.isArray($val)) {
      $val.unshift($prespace)
      $val.push($anspace)
    } else
    if(typeof $val === 'string') {
      $val = [
        $prespace, $val, $anspace
      ].join('')
    }
    return $val
  },
  Space: ($char = '', $length = 0) => {
    $length = (
      $length === -1 ||
      $length === 0 ||
      $length === undefined
    ) ? 0
      : $length
    let space = []
    space.length = (
      $length > -1
    ) ? $length
      : 0
    space = space
    .fill($char, 0, $length)
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
    const indent = Parsers.Indent(coindex)
    let blocks = $blocks
    .map((
      $block, $blockIndex
    ) => {
      // BLOCK - SPACE
      Parsers.SpaceInsert(
        $block,
        indent.anterScope, // '', 
        '',
      )
      // BLOCK - TAG
      Parsers.SpaceInsert(
        $block, 
        '', // '(➊➍)',
        '', // '(➀➃)',
      )
      return $block
    })
    .flat()
    .join('')
    return blocks
  },
  Block: ($block) => {
    return $block
    .flat()
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
}
export default Parsers