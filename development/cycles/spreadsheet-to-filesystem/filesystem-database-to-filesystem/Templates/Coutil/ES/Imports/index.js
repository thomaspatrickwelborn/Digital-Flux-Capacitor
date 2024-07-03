export default function Imports($data, $options = {}) {
  const { coutils, coindex } = $data
  const { Functions, Parsers } = coutils
  const _imports = []
  for(const $import of $data.content) {
    if($import.default === false) {
      _imports.push(
        ['import', Parsers.SpaceChar, '{']
      )
      var namedImportIndex = 0
      for(const $namedImport of $import.name) {
        if($namedImport.alias !== undefined) {
          if(namedImportIndex < $import.name.length - 1) {
            _imports.push(
              [
                Parsers.IndentChar, $namedImport.name, Parsers.SpaceChar, 
                'as', Parsers.SpaceChar, $namedImport.alias, ','
              ]
            )
          } else {
            _imports.push(
              [
                Parsers.IndentChar, $namedImport.name, Parsers.SpaceChar, 
                'as', Parsers.SpaceChar, $namedImport.alias
              ]
            )
          }
        } else {
          if(namedImportIndex < $import.name.length - 1) {
            _imports.push(
              [Parsers.IndentChar, $namedImport.name, ',']
            )
          } else {
            _imports.push(
              [Parsers.IndentChar, $namedImport.name]
            )
          }
        }
        namedImportIndex++
      }
      _imports.push(
        ['}', Parsers.SpaceChar, 'from', Parsers.SpaceChar, '"', $import.path, '"']
      )
    } else 
    if($import.default === true) {
      const namedImport = $import.name[0]
      if(namedImport !== undefined) {
        if(namedImport.alias !== undefined) {
          _imports.push(
            [
              'import', Parsers.SpaceChar, namedImport.name, Parsers.SpaceChar, 
              'as', Parsers.SpaceChar, namedImport.alias, Parsers.SpaceChar, 
              'from', Parsers.SpaceChar, '"', $import.path, '"'
            ]
          )
        } else {
          _imports.push(
            [
              'import', Parsers.SpaceChar, namedImport.name, Parsers.SpaceChar, 
              'from', Parsers.SpaceChar, '"', $import.path, '"'
            ]
          )
        }
      }
    }
  }
  return Parsers.Imports(_imports, $options)
}