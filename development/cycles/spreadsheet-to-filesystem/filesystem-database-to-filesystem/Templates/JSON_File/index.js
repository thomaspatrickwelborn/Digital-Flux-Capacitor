import { Blocks } from '../Coutil/ES/index.js'
const Parsers = {
  JSONFile: ($jsonFile) => $jsonFile
  .flat()
}
export default function ES_Markup($data) {
  const { coutils, content } = $data
  const _json_file = []
  const _blocks = Blocks({
    content: content.blocks,
    coutils: coutils,
  })
  _json_file.push(
    _blocks
  )
  return Parsers.JSONFile(_json_file)
}