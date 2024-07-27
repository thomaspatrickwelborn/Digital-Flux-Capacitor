export default function isNamedRange($rangeName, $ranges, $colsIndex) {
  return $ranges
  .filter(($range) => $range.Name.match(
    new RegExp(String.prototype.concat("^", $rangeName))
  ))
  .reduce(($isNamedRange, $namedRange) => {
    if(
      $colsIndex >= $namedRange.Ref.s.c &&
      $colsIndex <= $namedRange.Ref.e.c
    ) {
      $isNamedRange = true
    }
    return $isNamedRange
  }, false)
}