import Block from './Block/index.js'
export default function Blocks($data) {
  const { coutils, content } = $data
  const { Parsers } = coutils
  const blocks = []
  iterateBlocks:
  for(let $block of content) {
    const block = Block({
      content: $block,
      coutils: coutils,
    })
    blocks.push(block)
  }
  return Parsers.Blocks(blocks)
}