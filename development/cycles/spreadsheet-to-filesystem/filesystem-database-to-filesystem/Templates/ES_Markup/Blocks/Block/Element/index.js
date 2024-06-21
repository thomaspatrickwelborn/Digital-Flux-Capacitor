import Blocks from '../../index.js'
export default function Element($data) {
  const { coutils, content } = $data
  const { blocks, element } = content
  const { operators, parseTen, parse } = coutils
  const _element = []
  if(element === undefined) return _element
  const {
    tag, text, data
  } = element
  if(tag === undefined) return _element
  var { pos } = tag
  pos = pos || {}
  const inpos = pos.in
  console.log('inpos', inpos)
  const expos = pos.ex
  console.log('expos', expos)
  _element
  .push(
    [inpos, parseTen(tag.name)]
  )
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
    _element
    .push(
      [expos]
    )
  } else {
    _element
    .push(
      [expos]
    )
    if(blocks.length) { 
      _element
      .push(
        Blocks({
          content: blocks,
          coutils: coutils,
        })
      )
    }
    if(
      !operators.void.includes(tag.name)
    ) {
      _element
      .push(
        [inpos, '/', parseTen(tag.name),  expos]
      )
    }
  }
  return _element//.flat()
}