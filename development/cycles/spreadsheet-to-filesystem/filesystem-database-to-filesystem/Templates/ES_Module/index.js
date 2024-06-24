import {
  Imports,
  Blocks,
  Exports,
} from '../Coutil/ES/index.js'
export default function ESModule($data, $options = {}) {
  const { coutils, content } = $data
  const { Functions, Parsers } = coutils
  const _es_module = []
  const _imports = Imports({
    content: content.imports,
    coutils: coutils,
  }, $options)
  const _blocks = Blocks({
    content: content.blocks,
    coutils: coutils,
    coindex: {
      block: -1,
      scope: -1,
      blockLength: content.blocks.length,
    },
  }, $options)
  const _exports = Exports({
    content: content.exports,
    coutils: coutils,
  }, $options)
  _es_module.push(
    _imports, _blocks, _exports
  )
  // return Parsers.ESModule(_es_module, $options)
  return _es_module
  .filter(Functions.filterUndefined)
}