import Statement from './Statement/index.js'
export default function Block($data, $options = {}) {
  const { coutils, coindex } = $data
  const { Functions, Parsers } = coutils
  const _block = []
  if($data.content.statement !== undefined) {
    const _statement = Statement($data, $options)
    _block.push(_statement)
  }
  return Parsers.Block(_block)
}
