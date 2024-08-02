import {
  Imports,
  Exports,
} from '../Coutil/CJS/index.js'
import { Blocks } from '../Coutil/ES/index.js'
export default function CJSModule($data, $options = {}) {
  const { coutils, content } = $data
  const { Functions, Parsers } = coutils
  const _cjs_module = []
  if(content.imports !== undefined) {
    const _imports = Imports({
      content: content.imports,
      coutils: coutils,
    }, $options)
    _cjs_module.push(_imports)
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
    _cjs_module.push(_blocks)
  }
  if(content.exports !== undefined) {
    const _exports = Exports({
      content: content.exports,
      coutils: coutils,
    }, $options)
    _cjs_module.push(_exports)
  }
  return Parsers.CJSModule(_cjs_module, $options)
}