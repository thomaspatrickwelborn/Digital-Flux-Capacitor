import {
  Imports,
  Blocks,
  Exports,
} from '../Coutil/ES/index.js'
export default function ES_Markup($data, $options = {}) {
  const coutils = $data.coutils
  const { content } = $data.content
  const { Functions, Parsers } = coutils
  const _es_markup = []
  if(content.imports !== undefined) {
    const _imports = Imports({
      content: content.imports,
      coutils: coutils,
    }, $options)
    _es_markup.push(_imports)
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
    _es_markup.push(_blocks)
  }
  if(content.exports !== undefined) {
    const _exports = Exports({
      content: content.exports,
      coutils: coutils,
    }, $options)
    _es_markup.push(_exports)    
  }
  return Parsers.ESMarkup(_es_markup, $options)
}