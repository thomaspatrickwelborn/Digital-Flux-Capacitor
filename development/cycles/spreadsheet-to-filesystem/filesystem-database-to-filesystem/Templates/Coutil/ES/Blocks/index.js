import Block from './Block/index.js'
export default function Blocks($data) {
  const { coutils, content } = $data
  const { Parsers } = coutils
  const _blocks = []
  iterateBlocks:
  for(let $block of content) {
    const _block = Block({
      content: $block,
      coutils: coutils,
    })
    _blocks.push(_block)
  }
  return Parsers.Blocks(_blocks)
}