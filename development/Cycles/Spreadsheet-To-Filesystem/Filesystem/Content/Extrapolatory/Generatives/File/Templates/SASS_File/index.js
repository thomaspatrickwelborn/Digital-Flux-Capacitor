import { Imports } from '../Coutil/SCSS/index.js'
import { Blocks } from '../Coutil/ES/index.js'
export default function SASS_File($data, $options = {}) {
  const coutils = $data.coutils
  const { content } = $data.content
  const { Functions, Parsers } = coutils
  const _sass_file = []
  if(content.imports !== undefined) {
    const _imports = Imports({
      content: content.imports,
      coutils: coutils,
    }, $options)
    _sass_file.push(_imports)
  }
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
    _sass_file.push(_blocks)
  }
  return Parsers.SASSFile(_sass_file)
}