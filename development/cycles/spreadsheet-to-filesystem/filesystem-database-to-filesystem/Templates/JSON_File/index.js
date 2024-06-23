import { Blocks } from '../Coutil/ES/index.js'
export default function ES_Markup($data) {
  const { coutils, content } = $data
  const { Parsers } = coutils
  const _json_file = []
  const _blocks = Blocks({
    coindex: {
      block: -1,
      scope: -1,
      blockLength: content.blocks.length,
    },
    content: content.blocks,
    coutils: coutils,
  })
  _json_file.push(
    _blocks
  )
  return Parsers.JSONFile(_json_file)
}