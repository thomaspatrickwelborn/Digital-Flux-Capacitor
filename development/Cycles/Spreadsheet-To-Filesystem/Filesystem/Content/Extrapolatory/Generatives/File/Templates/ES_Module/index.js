import {
  Imports,
  Blocks,
  Exports,
} from '../Coutil/ES/index.js'
export default function ESModule($data, $options = {}) {
  const { coutils, content } = $data
  const { Functions, Parsers } = coutils
  const _es_module = []

  if(content.imports !== undefined) {
    const _imports = Imports({
      content: content.imports,
      coutils: coutils,
    }, $options)
    _es_module.push(_imports)
  }
  if(content.blocks !== undefined) {
    const _blocks = Blocks({
      content: content.blocks,
      coutils: coutils,
      coindex: {
        block: -1,
        scope: -1,
        blockLength: content.blocks.length,
      },
    }, $options)
    _es_module.push(_blocks)
  }
  if(content.exports !== undefined) {
    const _exports = Exports({
      content: content.exports,
      coutils: coutils,
    }, $options)
    _es_module.push(_exports)
  }
  return Parsers.ESModule(_es_module, $options)
}