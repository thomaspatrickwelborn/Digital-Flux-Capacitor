import Blocks from '../../index.js'
export default function Element($data, $options = {}) {
  const { coutils, content, coindex } = $data
  const { blocks, element } = content
  const { Operators, Parsers } = coutils
  const { space } = $options
  const { horizon } = space
  const _element = []
  if(element === undefined) return _element
  const {
    tag, text, data
  } = element
  if(tag === undefined) return _element
  var { name } = tag
  var nameParse = Parsers.Ten(name, '', '')
  var inapos = tag?.apos?.in || ''
  var exapos = tag?.apos?.ex || ''
  var indepos = tag?.depos?.in || ''
  var exdepos = tag?.depos?.ex || ''
  // ELEMENT TAG START OPEN
  _element.push(
    [inapos, nameParse]
  )
  // ELEMENT ATTRIBUTE
  const attribute = element?.attribute || {}
  if(Object.keys(attribute).length) {
    if(
      attribute.key !== undefined &&
      attribute.val !== undefined &&
      attribute.val !== Operators.tenSlug
    ) { 
      _element.push(
        [horizon.char, attribute.key, '=', `"${attribute.val}"`]
      )
    } else
    if(
      attribute.key !== undefined &&
      attribute.val === undefined
    ) { 
      _element.push(
        [horizon.char, attribute.key]
      )
    } else
    if(
      attribute.key === undefined &&
      attribute.val !== undefined &&
      attribute.val !== Operators.tenSlug
    ) { 
      _element.push(
        [horizon.char, attribute.val]
      )
    }
  }
  _element.push(
    [exapos]
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
  // ELEMENT TAG END
  if(
    !Operators.void.includes(nameParse)
  ) {
    _element.push(
      [indepos, nameParse, exdepos]
    )
  }
  return Parsers.Element(_element, Object.assign($options, {
    coindex
  }))
}