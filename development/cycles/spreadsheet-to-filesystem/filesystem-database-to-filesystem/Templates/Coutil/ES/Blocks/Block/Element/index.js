import Blocks from '../../index.js'
export default function Element($data, $options = {}) {
  const { coutils, content, coindex } = $data
  const { blocks, element } = content
  const { Functions, Operators, Parsers } = coutils
  const indent = Parsers.Indent(
    '  ', coindex.scope
  )
  const newLineIndent = Parsers.NewLineIndent(
    '  ', coindex.scope
  )
  const { tag, text } = element
  let _element = []
  // INAPOS
  let inapos = tag?.apos?.in
  _element.push(inapos)
  // NAME
  const tagName = (
    tag?.name &&
    !Functions.isSlug(tag.name)
  ) ? tag.name
    : ''
  if(tagName) {
    let name = tagName
    // NAME - SPACE
    name = Parsers.SpaceInsert(
      name, 
      '',
      ''
    )
    // NAME - TAG
    name = Parsers.SpaceInsert(
      name,
      '(➂➁)',
      '(➌➋)'
    )
    _element.push(name)
  }
  // ATTRIBUTE
  let attribute
  if(
    Object.keys(element?.attribute || {}).length
  ) {
    attribute = [
      element.attribute.key,
      element.attribute.per,
      element.attribute.val,
    ].join('')
  }
  if(attribute) {
    // ATTRIBUTE - SPACE
    attribute = Parsers.SpaceInsert(
      attribute, 
      Parsers.SpaceChar, 
      ''
    )
    // ATTRIBUTE - TAG
    attribute = Parsers.SpaceInsert(
      attribute, 
      '(➁➂)', 
      '(➋➌)'
    )
    _element.push(attribute)
  }
  // EXAPOS
  let exapos = tag?.apos?.ex
  if(
    exapos &&
    blocks.length
  ) {
    if(blocks.length === 1) {
      // EXAPOS - SPACE
      exapos = Parsers.SpaceInsert(
        exapos, 
        '', 
        ''
      )
      // EXAPOS - TAG
      exapos = Parsers.SpaceInsert(
        exapos, 
        '(➊)', 
        '(➀)'
      )
      _element.push(exapos)
    } else
    if(blocks.length > 1) {
      // EXAPOS - SPACE
      exapos = Parsers.SpaceInsert(
        exapos, 
        '', 
        ''
      )
      // EXAPOS - TAG
      exapos = Parsers.SpaceInsert(
        exapos, 
        '(➋)', 
        '(➁)'
      )
      _element.push(exapos)
    }
  }
  // BLOCKS
  let _blocks
  if(blocks.length) { 
    _blocks = Blocks({
      content: blocks,
      coindex: coindex,
      coutils: coutils,
    }, $options)
    _element.push(_blocks)
  }
  // EXAPOS
  if(
    exapos &&
    !blocks.length
  ) {
    // EXAPOS - SPACE
    exapos = Parsers.SpaceInsert(
      exapos, 
      '', 
      ''
    )
    // EXAPOS - TAG
    exapos = Parsers.SpaceInsert(
      exapos, 
      '(➌)', 
      '(➂)'
    )
    _element.push(exapos)
  }
  // EXTRAPOS
  if(
    tagName &&
    !Operators.void.includes(tagName)
  ) {
    let name = tagName
    let extrapos = []
    // INDEPOS
    let indepos = tag?.depos?.in
    // EXDEPOS
    let exdepos = tag?.depos?.ex
    extrapos = [
      indepos,
      name,
      exdepos,
    ].filter(($fragment) => $fragment)
    extrapos = (extrapos.length) ? extrapos : undefined
    // EXAPOS - SPACE
    extrapos = Parsers.SpaceInsert(
      extrapos,
      '',
      '',
    )
    // EXAPOS - TAG
    extrapos = Parsers.SpaceInsert(
      extrapos,
      '(➄➅)',
      '(➎➏)',
    )
    _element.push(extrapos)
  }
  _element = _element
  .filter(($fragment) => $fragment)
  return Parsers.Element(_element)
}
