import {
  Imports,
  Blocks,
  Exports,
} from '../Coutil/ES/index.js'
export default function ES_Markup($data, $options = {}) {
  const { coutils, content } = $data
  const coutils = $data.coutils
  const { content } = $data.content
  const { Functions, Parsers } = coutils
  const _es_markup = []
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
  const _exports = Exports({
    content: content.exports,
    coutils: coutils,
  }, $options)
  _es_markup.push(
    _imports, _blocks, _exports
  )
  return Parsers.ESMarkup(_es_markup, $options)
}