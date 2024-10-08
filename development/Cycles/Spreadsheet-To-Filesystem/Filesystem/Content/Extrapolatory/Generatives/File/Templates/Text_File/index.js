import { Blocks } from '../Coutil/Text/index.js'
export default function Text_File($data, $options = {}) {
  const { coutils, content } = $data
  const { Functions, Parsers } = coutils
  const _text_file = []
  if(content.blocks !== undefined) {
    const _blocks = Blocks({
      coindex: {
        block: -1,
        scope: -1,
        blockLength: content.blocks.length,
      },
      content: content.blocks,
      coutils: coutils,
    }, $options)
    _text_file.push(_blocks)
  }
  return Parsers.TextFile(_text_file)
}