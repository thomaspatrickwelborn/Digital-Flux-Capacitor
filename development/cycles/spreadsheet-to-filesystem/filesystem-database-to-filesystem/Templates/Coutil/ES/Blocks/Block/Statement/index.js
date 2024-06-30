import Blocks from '../../index.js'
export default function Statement($data, $options = {}) {
  const { coutils, content, coindex } = $data
  const { Functions, Operators, Parsers } = coutils
  const { blocks, statement } = content
  const { space } = $options
  const { horizon } = space
  const _statement = []
  if(statement === undefined) return
  const { lexter, dexter } = statement
  const expressions = [lexter, dexter]
  // const prespace = Parsers.Space('  ', coindex.scope)
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
    let { ser, ten, per, pos, par } = expression
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
      ser = Parsers.SpaceInsert(ser, '(➍)', '(➃)')
      ser = Parsers.SpaceInsert(ser, ' ', ' ')
    } else {
      ser = Parsers.SpaceInsert(ser, '(➎)', '(➄)')
      ser = Parsers.SpaceInsert(ser, '', '')
    }
    // ---
    // TEN
    // ---
    if(Functions.isSlug(ten)) {
      ten = undefined
    }
    if(expressionsIndex === 1) {
      ten = Parsers.SpaceInsert(ten, '(➍➍)', '(➃➃)')
      ten = Parsers.SpaceInsert(ten, '', '')
    } else
    if(expressionsIndex === 0) {
      ten = Parsers.SpaceInsert(ten, '(➎➎)', '(➄➄)')
      ten = Parsers.SpaceInsert(ten, ' ', '')
    } else {
      ten = Parsers.SpaceInsert(ten, '(➏)', '(➅)')
      ten = Parsers.SpaceInsert(ten, '(➏)', '(➅)')
    }
    // ---
    // PER
    // ---
    if(
      per && 
      Operators.assignmentShort.includes(per)
    ) {
      per = Parsers.SpaceInsert(per, '(➐)', '(➆)')
      per = Parsers.SpaceInsert(per, '(➐)', '(➆)')
    } else {
      per = Parsers.SpaceInsert(per, '(➑)', '(➇)')
      per = Parsers.SpaceInsert(per, '(➑)', '(➇)')
    }
    pos = pos || {}
    // -----
    // INPOS 
    // -----
    if(
      inpos &&
      blocks?.length > 1
    ) {
      inpos = Parsers.SpaceInsert(inpos, '(➒)', '(➈)')
      inpos = Parsers.SpaceInsert(inpos, '', '')
    } else {
      inpos = Parsers.SpaceInsert(inpos, '(➓)', '(➉)')
      inpos = Parsers.SpaceInsert(inpos, '', '')
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
      _blocks = (
        _blocks && 
        _blocks.length
      ) ? _blocks
        : undefined
    }
    // -----
    // EXPOS
    // -----
    if(
      expos &&
      _blocks?.length > 1
    ) {
      expos = Parsers.SpaceInsert(expos, '(➊➊)', '(➀➀)')
      expos = Parsers.SpaceInsert(expos, '', ' ')
    }
    // ---
    // PAR
    // ---
    if(par) {
      par = Parsers.SpaceInsert(par, '(➊➌)', '(➀➂)')
    }
    // --------------------
    // Expression Fragments
    // --------------------
    const expressionFragments = [
      // SER
      ser,
      // TEN
      ten,
      // PER
      per,
      // INPOS
      inpos,
      // _BLOCKS
      _blocks, 
      // EXPOS
      expos,
      // PAR
      par,
    ]
    .filter(($fragment) => $fragment)
    _statement.push(
      expressionFragments
    )
    expressionsIndex++
  }
  // console.log(
  //   '\n', '-----',
  //   '\n', '_statement', 
  //   '\n', Parsers.Statement(_statement),
  // )
  return Parsers.Statement(_statement)
}