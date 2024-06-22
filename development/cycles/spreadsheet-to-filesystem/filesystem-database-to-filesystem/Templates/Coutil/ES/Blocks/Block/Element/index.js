import Blocks from '../../index.js'
export default function Element($data) {
  const { coutils, content } = $data
  const { blocks, element } = content
  const { operators, Parsers } = coutils
  const _element = []
  if(element === undefined) return _element
  const {
    tag, text, data
  } = element
  if(tag === undefined) return _element
  var { name } = tag
  name = Parsers.Ten(name)
  var inapos = tag?.apos?.in || ''
  var exapos = tag?.apos?.ex || ''
  var indepos = tag?.depos?.in || ''
  var exdepos = tag?.depos?.ex || ''
  // ELEMENT TAG START OPEN
  _element
  .push(
    [inapos, name]
  )
  // ELEMENT ATTRIBUTE
  const attribute = element?.attribute || {}
  if(Object.keys(attribute).length) {
    if(
      attribute.key !== undefined &&
      attribute.val !== undefined &&
      attribute.val !== operators.tenSlug
    ) { 
      _element
      .push(
        [attribute.key, '=', `"${attribute.val}"`]
      )
    } else
    if(
      attribute.key !== undefined &&
      attribute.val === undefined
    ) { 
      _element
      .push(
        [attribute.key]
      )
    } else
    if(
      attribute.key === undefined &&
      attribute.val !== undefined &&
      attribute.val !== operators.tenSlug
    ) { 
      _element
      .push(
        [attribute.val]
      )
    }
  }
  _element
  .push(
    [exapos]
  )
  // ELEMENT BLOCKS
  if(blocks.length) { 
    _element
    .push(
      Blocks({
        content: blocks,
        coutils: coutils,
      })
    )
  }
  // ELEMENT TAG END
  if(
    !operators.void.includes(name)
  ) {
    _element
    .push(
      [indepos, name, exdepos]
    )
  }
  return Parsers.Element(_element)
}