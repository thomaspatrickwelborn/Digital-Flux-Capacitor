export default function Imports($data, $options = {}) {
  const { coutils, coindex } = $data
  const { Parsers } = coutils
  const _imports = []
  for(const $import of $data.content) {
    if($import.default === false) {
      _imports.push(
        [/*'\n', */'import', ' ', '{']
      )
      var namedImportIndex = 0
      for(const $namedImport of $import.name) {
        if($namedImport.alias !== undefined) {
          if(namedImportIndex < $import.name.length - 1) {
            _imports.push(
              [/*'\n', */'  ', $namedImport.name, ' ', 'as', ' ', $namedImport.alias, ',']
            )
          } else {
            _imports.push(
              [/*'\n', */'  ', $namedImport.name, ' ', 'as', ' ', $namedImport.alias]
            )
          }
        } else {
          if(namedImportIndex < $import.name.length - 1) {
            _imports.push(
              [/*'\n', */'  ', $namedImport.name, ',']
            )
          } else {
            _imports.push(
              [/*'\n', */'  ', $namedImport.name]
            )
          }
        }
        namedImportIndex++
      }
      _imports.push(
        [/*'\n', */'}', ' ', 'from', ' ', '"', $import.path, '"']
      )
    } else 
    if($import.default === true) {
      const namedImport = $import.name[0]
      if(namedImport !== undefined) {
        if(namedImport.alias !== undefined) {
          _imports.push(
            [/*'\n', */'import', ' ', namedImport.name, ' ', 'as', ' ', namedImport.alias, ' ', 'from', ' ', '"', $import.path, '"']
          )
        } else {
          _imports.push(
            [/*'\n', */'import', ' ', namedImport.name, ' ', 'from', ' ', '"', $import.path, '"']
          )
        }
      }
    }
  }
  return Parsers.Imports(_imports, $options)
}