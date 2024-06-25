import Blocks from '../../index.js'
export default function Element($data, $options = {}) {
  const { coutils, content, coindex } = $data
  const { blocks, element } = content
  const attribute = element?.attribute || {}
  const { Functions, Operators, Parsers } = coutils
  const { space } = $options
  const { horizon } = space
  const prespace = Parsers.Space('  ', coindex.scope)
  const _element = []
  if(element === undefined) return _element
  const {
    tag, text, data
  } = element
  if(tag === undefined) return _element
  var { name } = tag
  name = (
    Functions.isSlug(name)
  ) ? undefined
    : name
  var inapos = tag?.apos?.in
  var exapos = tag?.apos?.ex
  var indepos = tag?.depos?.in
  var exdepos = tag?.depos?.ex
  // ELEMENT TAG START OPEN
  _element.push(
    inapos, name,
  )
  // ELEMENT ATTRIBUTE
  if(Object.keys(attribute).length) {
    const { key, per, val } = attribute
    // ELEMENT ATTRIBUTE
    _element.push(
      key, per, val
    )
  }
  // ELEMENT TAG START CLOSE
  _element.push(
    exapos
  )
  // ELEMENT BLOCKS
  if(blocks.length) { 
    const _blocks = Blocks({
      content: blocks,
      coindex: coindex, 
      coutils: coutils,
    }, $options)
    _element.push(
      _blocks
    )
  }
  // ELEMENT TAG END OPEN/CLOSE
  if(
    !Operators.void.includes(name)
  ) {
    _element.push(
      indepos, name, exdepos
    )
  }
  return Parsers.Element(_element)
}