import Blocks from '../../index.js'
export default function Element($data, $options = {}) {
  const { coutils, content, coindex } = $data
  const { blocks, element } = content
  const { Functions, Operators, Parsers } = coutils
  // const prespace = Parsers.Space('  ', coindex.scope)
  const { tag, text } = element
  let _element = []
  // INAPOS
  let inapos = tag?.apos?.in
  _element.push(inapos)
  // NAME
  let name = tag?.name
  name = (
    !Functions.isSlug(name)
  ) ? name
    : undefined
  _element.push(name)
  // ATTRIBUTE
  let attribute = (
    Object.keys(element?.attribute || {}).length
  ) ? [
    element.attribute.key,
    element.attribute.per,
    element.attribute.val,
  ].join('')
    : undefined
  if(attribute) {
    if(coindex.blockLength > 1) {
      // attribute = Parsers.SpaceInsert(attribute, '(➁➁)', '(➋➋)')
      attribute = Parsers.SpaceInsert(attribute, ' ', '')
    } else {
      // attribute = Parsers.SpaceInsert(attribute, '(➁➂)', '(➋➌)')
      attribute = Parsers.SpaceInsert(
        attribute, 
        '',
        '\n'.concat(Parsers.Space('  ', coindex.scope - 1)), 
      )
    }
  }
  _element.push(attribute)
  // EXAPOS
  let exapos = tag?.apos?.ex
  if(
    exapos &&
    blocks.length
  ) {
    if(blocks.length === 1) {
      _element.push(
        // Parsers.SpaceInsert(exapos, '➊', '➀')
        Parsers.SpaceInsert(exapos, '➊', '➀')
      )
    } else
    if(blocks.length > 1) {
      _element.push(
        // Parsers.SpaceInsert(exapos, '➋', '➁')
        Parsers.SpaceInsert(exapos, '', '')
      )
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
    _element.push(
      // Parsers.SpaceInsert(exapos, '➌', '➂')
      Parsers.SpaceInsert(exapos, '', '')
    )
  }
  // EXTRAPOSEBLOCKS
  if(!Operators.void.includes(name)) {
    // INDEPOS
    let indepos = tag?.depos?.in
    _element.push(indepos)
    _element.push(name)
    // EXDEPOS
    let exdepos = tag?.depos?.ex
    _element.push(exdepos)
  }
  _element = _element
  .filter(($fragment) => $fragment)
  // console.log(
  //   '\n', '-----',
  //   '\n', '_element', 
  //   '\n', Parsers.Element(_element),
  // )
  return Parsers.Element(_element)
}
