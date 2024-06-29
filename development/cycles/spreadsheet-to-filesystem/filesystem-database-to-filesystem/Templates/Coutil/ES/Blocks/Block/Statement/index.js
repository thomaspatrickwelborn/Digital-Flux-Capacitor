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
    ser = (ser)
      ? (
        expressionsIndex === 1 &&
        Object.keys(
          expressions[expressionsIndex - 1]
        ).length
      // ) ? Parsers.SpaceInsert(ser, '➍', '➃')
      ) ? Parsers.SpaceInsert(ser, '', '')
        // : Parsers.SpaceInsert(ser, '➎', '➄')
        : Parsers.SpaceInsert(ser, '', '')
      : ser
    // ---
    // TEN
    // ---
    ten = (Functions.isSlug(ten))
      ? undefined
      : ten
    ten = (ten)
      // ? Parsers.SpaceInsert(ten, '➏', '➅')
    ? Parsers.SpaceInsert(ten, ' ', '➅')
      : ten
    // ---
    // PER
    // ---
    per = (
      per && 
      Operators.assignmentShort.includes(per)
    ) ? Parsers.SpaceInsert(per, '➐', '➆')
      : (per)
        ? Parsers.SpaceInsert(per, '➑', '➇')
        : per
    pos = pos || {}
    // -----
    // INPOS 
    // -----
    inpos = (
      inpos &&
      blocks?.length > 1
    // ) ? Parsers.SpaceInsert(inpos, '➒', '➈')
    ) ? Parsers.SpaceInsert(inpos, '', ' ')
      : (inpos)
        // ? Parsers.SpaceInsert(inpos, '➓', '➉')
        ? Parsers.SpaceInsert(inpos, '', '')
        : inpos
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
    expos = (
      expos &&
      _blocks?.length > 1
    // ) ? Parsers.SpaceInsert(expos, '(➊➊)', '(➀➀)')
    ) ? Parsers.SpaceInsert(expos, '', '')
      : (expos)
        ? Parsers.SpaceInsert(expos, '(➊➋)', '(➀➁)')
        : expos
    // ---
    // PAR
    // ---
    par = (par)
      ? Parsers.SpaceInsert(par, '(➊➌)', '(➀➂)')
      : par
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