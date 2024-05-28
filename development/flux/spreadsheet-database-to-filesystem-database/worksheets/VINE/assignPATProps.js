export default function assignPATProps($collect, $worksheet) {
  const lmnRanges = $worksheet.getLMNRanges(
   $worksheet.getRanges({ includeHidden: false })
  )
  console.log('lmnRanges', lmnRanges)
  return $collect
}