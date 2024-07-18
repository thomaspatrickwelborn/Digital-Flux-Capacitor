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
    let { ser, ten, pos } = expression
    pos = pos || {}
    let inpos = pos.in || ''
    let expos = pos.ex || ''
    // ---
    // SER
    // ---
    if(
      expressionsIndex === 1 &&
      Object.keys(
        expressions[expressionsIndex - 1]
      ).length
    ) {
      // SER - SPACE
      ser = Parsers.SpaceInsert(
        ser, 
        Parsers.SpaceChar, 
        Parsers.SpaceChar, 
      )
      // SER - TAG
      ser = Parsers.SpaceInsert(
        ser, 
        '', // '(➍)', 
        '', // '(➃)',
      )
    } else 
    if(expressionsIndex === 0) {
      // SER - SPACE
      ser = Parsers.SpaceInsert(
        ser, 
        '', 
        Parsers.SpaceChar
      )
      // SER - TAG
      ser = Parsers.SpaceInsert(
        ser, 
        '', // '(➎)', 
        '', // '(➄)'
      )
    }
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
    // -----
    // INPOS 
    // -----
    if(
      inpos &&
      blocks?.length > 1
    ) {
      // INPOS - SPACE
      inpos = Parsers.SpaceInsert(
        inpos, 
        '',
        '', // indent.anterScope,
      )
      // INPOS - TAG
      inpos = Parsers.SpaceInsert(
        inpos, 
        '', // '(➒)', 
        '', // '(➈)',  
      )
    } else {
      // INPOS - SPACE
      inpos = Parsers.SpaceInsert(
        inpos, 
        '', 
        ''
      )
      // INPOS - TAG
      inpos = Parsers.SpaceInsert(
        inpos, 
        '', // '(➓)', 
        '', //'(➉)',
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
    // -----
    // EXPOS
    // -----
    if(
      expos &&
      _blocks?.length > 1
    ) {
      // EXPOS - SPACE
      expos = Parsers.SpaceInsert(
        expos, 
        indent.meterScope, 
        ''
      )
      // EXPOS - TAG
      expos = Parsers.SpaceInsert(
        expos, 
        '', // '(➊➊)', 
        '', // '(➀➀)'
      )
    }
    // --------------------
    // Expression Fragments
    // --------------------
    const expressionFragments = [
      // SER
      ser,
      // TEN
      ten,
      // INPOS
      inpos,
      // _BLOCKS
      _blocks, 
      // EXPOS
      expos,
    ]
    .filter(($fragment) => $fragment)
    _statement.push(
      expressionFragments
    )
    expressionsIndex++
  }
  return Parsers.Statement(_statement)
}