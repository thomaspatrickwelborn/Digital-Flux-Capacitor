import { Blocks } from '../Coutil/ES/index.js'
export default function CSS_File($data, $options = {}) {
  const { coutils, content } = $data
  const { Functions, Parsers } = coutils
  const _css_file = []
  const _blocks = Blocks({
    coindex: {
      block: -1,
      scope: -1,
      blockLength: content.blocks.length,
    },
    content: content.blocks,
    coutils: coutils,
  }, $options)
  _css_file.push(
    _blocks
  )
  return Parsers.CSSFile(_css_file)
}