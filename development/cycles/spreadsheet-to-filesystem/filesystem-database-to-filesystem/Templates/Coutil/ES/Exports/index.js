export default function Exports($data, $options) {
  const { coutils, coindex } = $data
  const { Functions, Parsers } = coutils
  const _exports = []
  for(const $export of $data.content) {
    if($export.default !== true) {
      let nameIndex = 0
      const nameLength = $export.nameLength
      _exports.push(
        ['export', ' ', '{']
      )
      for(const $name of $export.name ) {
        const name = $name.name
        if(nameIndex < nameLength - 1) {
          _exports.push(
            [name, ',']
          )
        } else {
          _exports.push(
            [name]
          )
        }
        nameIndex++
      }
      _exports.push(['}'])
    } else {
      _exports.push(
        ['export', ' ', 'default', ' ', $export.name[0].name]
      )
    }
  }
  return Parsers.Exports(_exports, $options)
}