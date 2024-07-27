import typeOf from '#utils/typeOf/index.js'

const parseCell = ($cell) => {
  if(typeOf($cell) === 'string') {
    if(
      $cell.length === 0
    ) return undefined
    if(
      $cell.match(/([0-9])/g)?.length === $cell.length
    ) return Number($cell)
    if(
      $cell.length === 4 &&
      $cell.toLowerCase() === 'true'
    ) return true
    if(
      $cell.length === 5 &&
      $cell.toLowerCase() === 'false'
    ) return false
    if(
      $cell.length > 0
    ) {
      return $cell
    }
  }
  return $cell
}

export default parseCell