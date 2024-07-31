function valuesByPropertyKeyMatch(
  $target = [],
  $propKey = 'name',
  $matchRegExp,
  $matchVal = true
) {
  return $target
  .reduce(
    ($targetValues, $targetValue) => {
      const targetValuePropertyMatchRegExp = $targetValue[$propKey]
      .match(
        $matchRegExp
      )
      if(
        (
          $matchVal === true &&
          targetValuePropertyMatchRegExp.length !== 0
        ) ||
        (
          $matchVal === false &&
          targetValuePropertyMatchRegExp.length === 0
        )
      ) {
        $targetValues.push($targetValue)
      }
      return $targetValues
    }, []
  )
}
function entriesByEntryValuePropertyKeyMatch(
  $target = [],
  $propKey = 'name',
  $matchRegExp,
  $matchVal = true
) {
  return $target
  .reduce(
    ($targetEntries, [$targetEntryKey, $targetEntryValue]) => {
      const targetValuePropertyMatchRegExp = $targetEntryValue[$propKey]
      .match(
        $matchRegExp
      ) || []
      if(
        (
          $matchVal === true &&
          targetValuePropertyMatchRegExp.length !== 0
        ) ||
        (
          $matchVal === false &&
          targetValuePropertyMatchRegExp.length === 0
        )
      ) {
        $targetEntries.push([$targetEntryKey, $targetEntryValue])
      }
      return $targetEntries
    }, []
  )
}

export default {
  valuesByPropertyKeyMatch,
  entriesByEntryValuePropertyKeyMatch,
}