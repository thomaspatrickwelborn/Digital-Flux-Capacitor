import { Imports } from '../Coutil/SCSS/index.js'
import { Blocks } from '../Coutil/ES/index.js'
export default function SASS_File($data, $options = {}) {
  const { coutils, content } = $data
  const { Functions, Parsers } = coutils
  const _sass_file = []
  const _imports = Imports({
    content: content.imports,
    coutils: coutils,
  }, $options)
  const _blocks = Blocks({
    coindex: {
      block: -1,
      scope: -1,
      blockLength: content.blocks.length,
    },
    content: content.blocks,
    coutils: coutils,
  }, $options)
  _sass_file.push(
    _imports,
    _blocks
  )
  return Parsers.SASSFile(_sass_file)
}