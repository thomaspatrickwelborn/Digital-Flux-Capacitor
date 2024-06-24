import Blocks from '../../index.js'
export default function Statement($data, $options = {}) {
  const { coutils, content, coindex } = $data
  const { Operators, Parsers } = coutils
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
    var { ser, ten, per, pos, par } = expression
    pos = pos || {}
    const inpos = pos.in || ''
    const expos = pos.ex || ''
    const inposParse = Parsers.Inpos(inpos)
    const serParse = Parsers.Ser(ser, '', ' ')
    const tenParse = Parsers.Ten(ten, '', '')
    const perParse = (
      [':'].includes(per)
    ) ? Parsers.Per(per, '', ' ')
      : Parsers.Per(per, ' ', ' ')
    _statement.push(
      [
        serParse,
        tenParse,
        perParse,
        inpos,
      ]
    )
    if(blocks.length) {
      const _blocks = Blocks({
        content: blocks,
        coindex: coindex,
        coutils: coutils,
      }, $options)
      _statement.push(
        _blocks
      )
    }
    _statement.push(
      [expos, par]
    )
    expressionsIndex++
  }
  return Parsers.Statement(
    _statement, 
    Object.assign($options, {
      coindex
    })
  )
}