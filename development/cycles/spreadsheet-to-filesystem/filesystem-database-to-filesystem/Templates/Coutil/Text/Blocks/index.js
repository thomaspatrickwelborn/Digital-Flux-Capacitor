import Block from './Block/index.js'
export default function Blocks($data, $options) {
  console.log($data)
  const { coutils, content, coindex } = $data
  const { Functions, Parsers } = coutils
  const blocks = []
  if(content.length) {
    const scopeIndex = coindex.scope + 1
    let blockIndex = 0
    const blockLength = content.length
    iterateBlocks:
    for(let $block of content) {
      const block = Block({
        coindex: {
          scope: scopeIndex,
          block: blockIndex,
          blockLength: blockLength,
        },
        content: $block,
        coutils: coutils,
      }, $options)
      blocks.push(block)
      blockIndex++
    }
  }
  return Parsers.Blocks(blocks, {
    coindex
  })
}