import Blocks from '../Coutil/ES/Blocks/index.js'
export default function ES_Markup($data) {
  const { coutils, content } = $data
  console.log('content', content)
  const _json_file = []
  const _blocks = Blocks({
    content: content.blocks,
    coutils: coutils,
  })
  _json_file.push(
    _blocks
  )
  return _json_file
}