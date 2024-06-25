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
    ten = (
      Functions.isSlug(ten)
    ) ? undefined
      : ten
    const inpos = pos.in || ''
    const expos = pos.ex || ''
    let _blocks
    if(blocks.length) {
      _blocks = Blocks({
        content: blocks,
        coindex: coindex,
        coutils: coutils,
      }, $options)
    }
    const prespace = Parsers.Space('  ', coindex.scope)
    const expressionFragments = [
      // SER
      (ser)
        ? Parsers.Ser(ser, '', ' ')
        : ser,
      // TEN
      (ten)
        ? Parsers.Ten(ten, '', '')
        : ten,
      // PER
      (
        per && 
        Operators.assignmentShort.includes(per)
      ) ? Parsers.Per(per, '', ' ')
        : (per)
          ? Parsers.Per(per, ' ', ' ')
          : per,
      // INPOS 
      (
        inpos &&
        _blocks?.length > 1
      ) ? Parsers.Inpos(inpos, '', '\n')
        : (inpos)
          ? Parsers.Inpos(inpos, '', '')
          : inpos,
      // Blocks
      (
        _blocks && 
        _blocks.length
      ) ? _blocks
        : undefined, 
      // Expos
      (
        expos &&
        _blocks?.length > 1
      ) ? Parsers.Expos(expos, '\n'.concat(prespace), '')
        : (expos)
          ? Parsers.Expos(expos, '', '')
          : expos,
      // PAR
      (par)
        ? Parsers.Par(par, '', '')
        : par
    ]
    .filter(($fragment) => $fragment)
    _statement.push(
      expressionFragments
    )
    expressionsIndex++
  }
  return Parsers.Statement(_statement)
}