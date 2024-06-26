import Blocks from '../../index.js'
export default function Element($data, $options = {}) {
  const { coutils, content, coindex } = $data
  const { blocks, element, attributes } = content
  console.log('-----')
  console.log('attributes', attributes.length, attributes)
  const attribute = element?.attribute || {}
  const { Functions, Operators, Parsers } = coutils
  const prespace = Parsers.Space('  ', coindex.scope)
  const _element = []
  if(element === undefined) return _element
  const {
    tag, text, data
  } = element
  if(tag === undefined) return _element
  let { name } = tag
  name = (
    Functions.isSlug(name)
  ) ? undefined
    : name
  // ELEMENT TAG START OPEN
  var inapos = tag?.apos?.in
  var exapos = tag?.apos?.ex
  var indepos = tag?.depos?.in
  var exdepos = tag?.depos?.ex
  // ELEMENT ATTRIBUTE
  const { key, per, val } = attribute
  const _attribute = [key, per, val]
  .filter(($attributeFragment) => $attributeFragment)
  .join('')
  // ELEMENT TAG START CLOSE
  // ELEMENT BLOCKS
  let _blocks
  if(blocks.length) { 
    _blocks = Blocks({
      content: blocks,
      coindex: coindex, 
      coutils: coutils,
    }, $options)
  } else
  if(attributes.length) {
    _blocks = Blocks({
      content: attributes,
      coindex: coindex,
      coutils, coutils,
    })
  }
  // ELEMENT TAG END OPEN/CLOSE
  _element.push(
    // INAPOS
    (inapos) ? inapos : '', 
    // NAME
    (name)
    ? Parsers.SpaceInsert(name, '', (
        attributes?.length > 1
      ) ? '\n'
        : ' '
    ) : name,
    // ATTRIBUTE
    (_attribute)
    ? Parsers.SpaceInsert(_attribute, prespace, '')
    : _attribute,
    (exapos) ? exapos : '', 
    (_blocks) ? _blocks : '', 
    // 
    (!Operators.void.includes(name))
    ? [
      (indepos) ? indepos : '', 
      (name) ? name : '', 
      (exdepos) ? exdepos : ''
    ].join('')
    : ''
  )
  console.log('_element', _element)
  return Parsers.Element(_element)
}