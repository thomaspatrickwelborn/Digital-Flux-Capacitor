import Blocks from '../../index.js'
export default function Element($data, $options = {}) {
  const { coutils, content, coindex } = $data
  const { blocks, element, attributes } = content
  const attribute = element?.attribute || {}
  const { Functions, Operators, Parsers } = coutils
  const prespace = Parsers.Space('  ', coindex.scope)
  // const _element = []
  // if(element === undefined) return _element
  const {
    tag, text, data
  } = element
  // if(tag === undefined) return _element
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
  // console.log('-----')
  // console.log('$data.content', $data.content)
  // console.log('key, per, val', key, per, val)
  const _attribute = [key, per, val]
  .filter(($attributeFragment) => $attributeFragment)
  .join('')
  // console.log('__attribute', _attribute)
  // ELEMENT TAG START CLOSE
  // ELEMENT BLOCKS
  let _blocks
  if(blocks.length) { 
    _blocks = Blocks({
      content: blocks,
      coindex: coindex, 
      coutils: coutils,
    }, $options)
  }
  // ELEMENT TAG END OPEN/CLOSE
  const _element = [
    // INAPOS
    (inapos) ? inapos : '', 
    // NAME
    (name) ? name : '',
    // ATTRIBUTE
    (attributes?.length)
    ? attributes.map(($attribute, $attributeIndex) => {
        let { key, per, val } = $attribute?.element?.attribute || {}
        let attribute = [key, per, val]
        .filter(($attributeFragment) => $attributeFragment)
        .join('')
        if(attributes.length > 1) {
          attribute = Parsers.SpaceInsert(
            attribute, 
            '\n'.concat(Parsers.Space('  ', coindex.scope + 1)),
          )
          if($attributeIndex === attributes.length - 1) {
            attribute = Parsers.SpaceInsert(
              attribute,
              '',
              '\n'.concat(Parsers.Space('  ', coindex.scope)),
            )
          }
        } else {
          attribute = Parsers.SpaceInsert(attribute, ' ', '')
        }
        return attribute
      })
    : attributes,
    // EXAPOS
    (exapos)
    ? (blocks?.length)
      ? Parsers.SpaceInsert(
        exapos,
        '',
        '\n'.concat(Parsers.Space('  ', coindex.scope)),
      )
      : exapos
    : exapos, 
    (_blocks) ? _blocks : '', 
    // DEPOS
    (!Operators.void.includes(name))
    ? [
      (indepos) ? indepos : '', 
      (name) ? name : '', 
      (exdepos) ? exdepos : ''
    ].join('')
    : ''
  ]
  .filter(($element) => $element)
  // console.log('_element', Parsers.Element(_element))
  return Parsers.Element(_element)
}