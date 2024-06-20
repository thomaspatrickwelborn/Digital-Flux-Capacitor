import Blocks from '../../index.js'
export default function Element($data) {
  const { coutils, content } = $data
  const { blocks, element } = content
  const { operators, parseTen } = coutils
  const _element = []
  if(element === undefined) return _element
  const {
    tag, attributes, text, data
  } = element
  if(tag === undefined) return _element
  var { pos } = tag
  pos = pos || {}
  const inpos = pos.in
  const expos = pos.ex
  _element.push(
    [inpos, parseTen(tag.name)]
  )
  iterateAttributes:
  for(const $attribute of attributes) {
    if(
      $attribute.key !== undefined &&
      $attribute.ten !== undefined &&
      $attribute.ten !== operators.tenSlug
    ) { 
      _element.push(
        [$attribute.key, '=', '"$attribute.ten"']
      )
     } else
    if(
      $attribute.key !== undefined &&
      $attribute.ten === undefined
    ) { 
      _element.push(
        [$attribute.key]
      )
     } else
    if(
      $attribute.key === undefined &&
      $attribute.ten !== undefined &&
      $attribute.ten !== operators.tenSlug
    ) { 
      _element.push(
        [$attribute.ten]
      )
     } 
   } 
   _element.push(expos)
  if(blocks.length) { 
    _element.push(
      Blocks({
        content: blocks,
        coutils: coutils,
      })
    )
  } 
   if(
    !operators.void.includes(tag.name)
  ) { 
    _element.push(
      [inpos, '/', parseTen(tag.name),  expos]
    )
   } 
  return _element
}