import Block from './Block/index.js'
const Parsers = {
  Blocks: ($blocks) => $blocks
  .flat()
}
export default function Blocks($data) {
  const { coutils, content } = $data
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