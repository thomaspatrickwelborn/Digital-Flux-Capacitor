export default function assignPATProps($collect, $worksheet) {
  const lmnRanges = $worksheet.getLMNRanges(
   $worksheet.getRanges({ includeHidden: false })
  )
  iterateLMNRanges: 
  for(const [
    $lmnRangeName, $lmnRangeSettings
  ] of lmnRanges) {
    console.log($lmnRangeName, $lmnRangeSettings)
    const { PAT } = $lmnRangeSettings
  }
  return $collect
}