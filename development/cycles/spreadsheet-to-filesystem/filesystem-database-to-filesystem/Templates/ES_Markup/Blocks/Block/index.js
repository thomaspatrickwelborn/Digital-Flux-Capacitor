import Element from './Element/index.js'
import Statement from './Statement/index.js'
export default function Block($data) {
  const _block = []
  const _element = Element($data)
  const _statement = Statement($data)
  _block.push(_element, _statement)
  return _block
}
