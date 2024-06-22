import {
  Imports,
  Blocks,
  Exports,
} from '../Coutil/ES/index.js'
export default function ES_Markup($data) {
  const { coutils, content } = $data
  const _es_markup = []
  const _imports = Imports({
    content: content.imports,
    coutils: coutils,
  })
  const _blocks = Blocks({
    content: content.blocks,
    coutils: coutils,
  })
  const _exports = Exports({
    content: content.exports,
    coutils: coutils,
  })
  _es_markup.push(
    _imports, _blocks, _exports
  )
  return _es_markup
}