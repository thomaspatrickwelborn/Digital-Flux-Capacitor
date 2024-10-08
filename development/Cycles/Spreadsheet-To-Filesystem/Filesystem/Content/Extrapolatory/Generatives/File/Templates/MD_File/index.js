import { Blocks } from '../Coutil/MD/index.js'
export default function MD_File($data, $options = {}) {
  const { coutils, content } = $data
  const { Functions, Parsers } = coutils
  const _md_file = []
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
    _md_file.push(_blocks)
  }
  return Parsers.MDFile(_md_file)
}