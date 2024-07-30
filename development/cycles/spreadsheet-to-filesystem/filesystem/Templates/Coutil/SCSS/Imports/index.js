export default function Imports($data, $options = {}) {
  const { coutils, coindex } = $data
  const { Functions, Parsers } = coutils
  const _imports = []
  for(const $import of $data.content) {
    const namedImport = $import.name[0]
    if(namedImport !== undefined) {
      if(namedImport.alias !== undefined) {
        _imports.push(
          [
            '@use', Parsers.SpaceChar, '"', $import.path, '"', 
            'as', Parsers.SpaceChar, namedImport.alias, Parsers.SpaceChar, ';'
          ]
        )
      } else {
        _imports.push(
          [
            '@use', Parsers.SpaceChar, '"', $import.path, '"', ';'
          ]
        )
      }
    }
  }
  return Parsers.Imports(_imports, $options)
}
