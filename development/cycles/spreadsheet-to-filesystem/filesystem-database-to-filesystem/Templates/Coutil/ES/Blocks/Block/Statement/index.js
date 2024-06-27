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
    // Expression Fragments
    let { ser, ten, per, pos, par } = expression
    pos = pos || {}
    let inpos = pos.in || ''
    let expos = pos.ex || ''
    // SER
    ser = (ser)
      ? (
        expressionsIndex === 1 &&
        Object.keys(
          expressions[expressionsIndex - 1]
        ).length
      ) ? Parsers.SpaceInsert(ser, ' ', ' ')
        : Parsers.SpaceInsert(ser, '', ' ')
      : ser
    // TEN
    ten = (Functions.isSlug(ten))
      ? undefined
      : ten
    ten = (ten)
      ? Parsers.Ten(ten, '', '')
      : ten
    // PER
    per = (
      per && 
      Operators.assignmentShort.includes(per)
    ) ? Parsers.Per(per, '', ' ')
      : (per)
        ? Parsers.Per(per, ' ', ' ')
        : per
    pos = pos || {}
    // INPOS 
    inpos = (
      inpos &&
      blocks?.length > 1
    ) ? Parsers.Inpos(inpos, '', '\n')
      : (inpos)
        ? Parsers.Inpos(inpos, '', '')
        : inpos
    // BLOCKS
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
    // EXPOS
    expos = (
      expos &&
      _blocks?.length > 1
    ) ? Parsers.Expos(expos, '\n'.concat(
      Parsers.Space('  ', coindex.scope)
    ), '')
      : (expos)
        ? Parsers.Expos(expos, '', '')
        : expos
    // PAR
    par = (par)
      ? Parsers.Par(par, '', '')
      : par
    
    const expressionFragments = [
      ser,
      ten,
      per,
      inpos,
      _blocks, 
      expos,
      par,
    ]
    .filter(($fragment) => $fragment)
    _statement.push(
      expressionFragments
    )
    expressionsIndex++
  }
  console.log(
    '\n', '-----',
    '\n', '_statement', 
    // '\n', _statement,
    '\n', Parsers.Statement(_statement),
  )
  return Parsers.Statement(_statement)
}