import Block from './Block/index.js'
export default function Blocks($data) {
  const { coutils, content, coindex } = $data
  console.log(coindex)
  const { Parsers } = coutils
  const blocks = []
  coindex.scope++
  iterateBlocks:
  for(let $block of content) {
    coindex.block++
    const block = Block({
      coindex: coindex,
      content: $block,
      coutils: coutils,
    })
    blocks.push(block)
  }
  return Parsers.Blocks(blocks)
}