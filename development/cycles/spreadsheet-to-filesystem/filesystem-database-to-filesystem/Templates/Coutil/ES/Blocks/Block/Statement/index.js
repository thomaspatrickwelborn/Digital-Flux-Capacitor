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
    const expressionFragments = [
      ser, ten, per, inpos, _blocks, expos, par
    ].filter(Functions.filterUndefined)
    _statement.push(
      expressionFragments
    )
    expressionsIndex++
  }
  return _statement
  .filter(Functions.filterUndefined)
}