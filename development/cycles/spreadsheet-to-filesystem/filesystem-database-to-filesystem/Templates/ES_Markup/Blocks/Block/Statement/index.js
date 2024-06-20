import Blocks from '../../index.js'
export default function Statement($data) {
  const { coutils, content } = $data
  const { operators, parseTen, parse } = coutils
  const { blocks, statement } = content
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
    var { ser, ten, per, pos, par } = expression
    pos = pos || {}
    const inpos = pos.in
    const expos = pos.ex
    _statement.push(
      [ser, parseTen(ten), per, inpos]
    )
    if(blocks.length) {
      _statement.push(
        Blocks({
          content: blocks,
          coutils: coutils,
        })
      ) 
    }
    _statement.push(
      [expos, par]
    )
    expressionsIndex++
  }
  return _statement//.flat()
}