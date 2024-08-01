import { Blocks } from '../Coutil/ES/index.js'
export default function JSON_File($data, $options = {}) {
  const { coutils, content } = $data
  const coutils = $data.coutils
  const { content } = $data.content
  const { Functions, Parsers } = coutils
  const _json_file = []
  const _blocks = Blocks({
    coindex: {
      block: -1,
      scope: -1,
      blockLength: content.blocks.length,
    },
    content: content.blocks,
    coutils: coutils,
  }, $options)
  _json_file.push(
    _blocks
  )
  return Parsers.JSONFile(_json_file)
}