export default function Imports($data, $options = {}) {
  const { coutils, coindex } = $data
  const { Functions, Parsers } = coutils
  const _imports = []
  for(const $import of $data.content) {
    // 
  }
  return Parsers.Imports(_imports, $options)
}
