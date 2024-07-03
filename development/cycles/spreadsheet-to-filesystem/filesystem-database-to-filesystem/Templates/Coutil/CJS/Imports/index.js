export default function Imports($data, $options = {}) {
  const { coutils, coindex } = $data
  const { Functions, Parsers } = coutils
  const _imports = []
  for(const $import of $data.content) {
    if($import.default === false) {
      _imports.push(
        [
          $import.declare, Parsers.SpaceChar, '{',
        ]
      )
      var namedImportIndex = 0
      for(const $namedImport of $import.name) {
        if(namedImportIndex < $import.name.length - 1) {
          _imports.push(
            [
              Parsers.IndentChar, $namedImport.name, ','
            ]
          )
        } else {
          _imports.push(
            [
              Parsers.IndentChar, $namedImport.name, 
            ]
          )
        }
        namedImportIndex++
      }
      _imports.push(
        [
          '}', Parsers.SpaceChar, '=', Parsers.SpaceChar, 
          'require', '(', 
          '"', $import.path, '"', 
          ')', $import.par,
        ]
      )
    } else 
    if($import.default === true) {
      const namedImport = $import.name[0]
      if(namedImport !== undefined) {
        _imports.push(
          [
            $import.declare, namedImport, 
            Parsers.SpaceChar, '=', Parsers.SpaceChar,
            'require', '(',
            '"', $import.path, '"', $import.par,
            ')', $import.par,
          ]
        )
      }
    }
  }
  return Parsers.Imports(_imports, $options)
}