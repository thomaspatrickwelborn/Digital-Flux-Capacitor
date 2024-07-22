import Blocks from '../../index.js'
export default function Statement($data, $options = {}) {
  const { coutils, content, coindex } = $data
  const { Functions, Operators, Parsers } = coutils
  const { blocks, statement } = content
  const { space } = $options
  const { horizon } = space
  const _statement = []
  if(statement === undefined) return
  const { lexter } = statement
  const expressions = [lexter]
  const indent = Parsers.Indent(coindex)
  var expressionsIndex = 0
  iterateExpressions:
  while(expressionsIndex < expressions.length) {
    const expression = expressions[expressionsIndex]
    if(expression === undefined) {
      expressionsIndex++
      continue iterateExpressions
    }
    // --------------------
    // Expression Fragments
    // --------------------
    let {
      ser,
      ten,
    } = expression
    // ---
    // SER
    // ---
    // SER - SPACE
    ser = Parsers.SpaceInsert(
      ser, 
      '', 
      Parsers.SpaceChar, 
    )
    // SER - TAG
    ser = Parsers.SpaceInsert(
      ser, 
      '', // '(➍)', 
      '', // '(➃)',
    )
    // ---
    // TEN
    // ---
    if(Functions.isSlug(ten)) {
      ten = undefined
    }
    if(expressionsIndex === 1) {
      // TEN - SPACE
      ten = Parsers.SpaceInsert(
        ten, 
        '', 
        ''
      )
      // TEN - TAG
      ten = Parsers.SpaceInsert(
        ten, 
        '', // '(➍➍)', 
        '', // '(➃➃)',
      )
    } else
    if(expressionsIndex === 0) {
      // TEN - SPACE
      ten = Parsers.SpaceInsert(
        ten, 
        '', 
        ''
      )
      // TEN - TAG
      ten = Parsers.SpaceInsert(
        ten, 
        '', // '(➎➎)', 
        '', // '(➄➄)'
      )
    } else {
      // TEN - SPACE
      ten = Parsers.SpaceInsert(
        ten, 
        '', 
        ''
      )
      // TEN - TAG
      ten = Parsers.SpaceInsert(
        ten, 
        '(➏)', 
        '(➅)'
      )
    }
    // ------
    // BLOCKS
    // ------
    let _blocks
    if(blocks.length) {
      _blocks = Blocks({
        content: blocks,
        coindex: coindex,
        coutils: coutils,
      }, $options)
    }
    // --------------------
    // Expression Fragments
    // --------------------
    const expressionFragments = [
      // SER
      ser,
      // TEN
      ten,
      // _BLOCKS
      _blocks, 
    ]
    .filter(($fragment) => $fragment)
    _statement.push(
      expressionFragments
    )
    expressionsIndex++
  }
  return Parsers.Statement(_statement)
}