import {
  Imports,
  Exports
} from '../Coutil/CJS/index.js'
import { Blocks } from '../Coutil/ES/index.js'
export default function CJSModule($data, $options = {}) {
  const { coutils, content } = $data
  const { Functions, Parsers } = coutils
  const _cjs_module = []
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
  _cjs_module.push(
    _imports, _blocks, _exports
  )
  return Parsers.CJSModule(_cjs_module, $options)
}