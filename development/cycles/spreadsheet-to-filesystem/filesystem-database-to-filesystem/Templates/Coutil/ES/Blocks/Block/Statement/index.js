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
      // SER
      Parsers.Ser(ser, '', ' '),
      // TEN
      Parsers.Ten(ten, '', ''),
      // PER
      (
        Operators.assignmentShort.includes(per)
      ) ? Parsers.Per(per, '', ' ')
        : Parsers.Per(per, ' ', ' '),
      // INPOS, 
      (
        _blocks?.length > 1
      ) ? Parsers.Inpos(inpos, '', '\n')
        : Parsers.Inpos(inpos, '', ''),
      // Blocks
      _blocks, 
      // Expos
      (
        _blocks?.length > 1
      ) ? Parsers.Expos(expos, '\n', '')
        : Parsers.Expos(expos, '', ''),
      Parsers.Par(par, '', '')
    ].filter(Functions.filterUndefined)
    _statement.push(
      expressionFragments
    )
    const _expressionFragments = []
    // -----
    // Property Declarations
    // Property Declaration Evocation
    if(ser && ten && per && inpos && _blocks && expos) {
      _expressionFragments.push(
        ser, 
      )
    } else
    // Property Declaration Invocation
    if(ser && ten && per && !inpos && !blocks && !expos) {
      /* */
    } else

    // -----
    // Property Assignments
    // Property Assignment Evocation
    if(!ser && ten && per && inpos && _blocks && expos) {
      /* */
    } else
    // Property Assignment Invocation
    if(!ser && ten && per && !inpos && !_blocks && !expos) {
      /* */
    } else

    // -----
    // Property Accessors
    // Property Accessor Evocation
    if(!ser && ten && !per && inpos && _blocks && expos) {
      /* */
    } else
    // Property Accessor Invocation
    if(!ser && ten && !per && !inpos && !_blocks && !expos) {
      /* */
    } else
    // Anonymous Invocation
    if(!ser && !ten && !per && inpos && _blocks && expos) {
      /* */
    } else

    // -----
    // Statements
    // Statement Provocation
    if(ser && !ten && !per && inpos && _blocks && expos) {
      /* */
    } else
    // Statement Revocation
    if(ser && !ten && !per && !inpos && !_blocks && !expos) {
      /* */
    }
    expressionsIndex++
  }
  const renderStatement = _statement
  .filter(($fragment) => {
    const fragmentUndefined = (
      typeof $fragment === 'object'
    ) ? Object.keys($fragment).length
      : $fragment
    return fragmentUndefined
  })
  .flat()
  console.log('renderStatement', renderStatement)
  return renderStatement
  return ''
}