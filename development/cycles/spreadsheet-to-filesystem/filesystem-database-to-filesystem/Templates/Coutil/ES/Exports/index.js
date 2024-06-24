export default function Exports($data, $options) {
  const { coutils, coindex } = $data
  const { Parsers } = coutils
  const _exports = []
  for(const $export of $data.content) {
    if($export.default !== true) {
      let nameIndex = 0
      const nameLength = $export.nameLength
     
      export {
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
    } else {
      ['export', ' ', 'default', ' ', $export.name[0].name]
    }
  }
  return Parsers.Exports(_exports, $options)
}