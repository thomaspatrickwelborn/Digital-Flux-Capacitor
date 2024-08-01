import Blocks from '../../index.js'
export default function Element($data, $options = {}) {
  const { coutils, content, coindex } = $data
  const { blocks, element } = content
  const { Functions, Operators, Parsers } = coutils
  const indent = Parsers.Indent(coindex)
  const { tag, text } = element
  let _element = []
  // INAPOS
  let inapos = tag?.apos?.in
  // EXAPOS
  let exapos = tag?.apos?.ex
  // INDEPOS
  let indepos = tag?.depos?.in
  // EXDEPOS
  let exdepos = tag?.depos?.ex
  _element.push(inapos)
  // NAME
  const tagName = (
    tag?.name &&
    !Functions.isSlug(tag.name)
  ) ? tag.name
    : ''
  if(
    tagName &&
    (inapos && exapos)
  ) {
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
      '', // '(➂➁)', 
      '', // '(➌➋)',
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
      '', // '(➆➈)', 
      '', // '(➐➒)',
    )
    _element.push(attribute)
  }
  let _blocks
  if(blocks.length) {
    if(
      (indepos && exdepos)
    ) {
      // Exapos - SPACE
      exapos = Parsers.SpaceInsert(
        exapos, 
        '', // Parsers.SpaceChar, 
        ''
      )
      // Exapos - TAG
      exapos = Parsers.SpaceInsert(
        exapos, 
        '', // '(➆➇)', 
        '', // '(❼❽)',
      )
      _element.push(exapos)
    }
    // BLOCKS
    _blocks = Blocks({
      content: blocks,
      coindex: coindex,
      coutils: coutils,
    }, $options)
    _element.push(_blocks)
    if(
      (!indepos && !exdepos) &&
      (inapos && exapos)
    ) {
      // Exapos - SPACE
      exapos = Parsers.SpaceInsert(
        exapos, 
        indent.meterScope, // Parsers.SpaceChar, 
        ''
      )
      // Exapos - TAG
      exapos = Parsers.SpaceInsert(
        exapos, 
        '', // '(➇➀)', 
        '', // '(➑➊)',
      )
      _element.push(exapos)
    }
  } else
  if(!blocks.length) {
    exapos = Parsers.SpaceInsert(
      exapos, 
      '', //Parsers.SpaceChar, 
      ''
    )
    // Exapos - TAG
    exapos = Parsers.SpaceInsert(
      exapos, 
      '', // '(➇➁)', 
      '', // '(❽❷)',
    )
    _element.push(exapos)
  }
  // TEXT
  if(
    text &&
    Object.keys(text).length
  ) {
    const textTen = text.ten || ''
    _element.push(textTen)
  }
  // EXTRAPOS
  if(
    tagName &&
    (indepos && exdepos) &&
    !Operators.void.includes(tagName)
  ) {
    let name = tagName
    let extrapos = []
    extrapos = [
      indepos,
      name,
      exdepos,
    ].filter(($fragment) => $fragment)
    extrapos = (extrapos.length) ? extrapos : undefined
    // EXAPOS - SPACE
    if(blocks.length) {
      extrapos = Parsers.SpaceInsert(
        extrapos,
        indent.meterScope,
        '',
      )
    } else
    if(!blocks.length) {
      extrapos = Parsers.SpaceInsert(
        extrapos,
        '',
        '',
      )
    }
    // EXAPOS - TAG
    extrapos = Parsers.SpaceInsert(
      extrapos,
      '', // '(➄➅)',
      '', // '(➎➏)',
    )
    _element.push(extrapos)
  }
  _element = _element
  .filter(($fragment) => $fragment)
  return Parsers.Element(_element)
}
