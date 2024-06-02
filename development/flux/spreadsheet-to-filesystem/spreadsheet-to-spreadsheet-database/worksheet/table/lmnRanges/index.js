export default class LMNRanges extends EventTarget {
  constructor($settings) {
    super()
    const lmnRanges = $settings
    .reduce((
      $lmnRanges,
      $lmnRange, $lmnRangeIndex
    ) => {
      const lmnRangeGroupNameData = $lmnRange.Name.split('_')
      const lmnRangeGroupName = String.prototype.concat(
        lmnRangeGroupNameData[0],
        '_',
        lmnRangeGroupNameData[1]
      )
      $lmnRanges[lmnRangeGroupName] = $lmnRanges[lmnRangeGroupName] || {}
      const lmnRangeGroup = $lmnRanges[lmnRangeGroupName]
      if($lmnRange.Name.match(new RegExp(/^LMN_[0-9]$/))) {
        Object.assign(lmnRangeGroup, $lmnRange)
      } else
      if(
        $lmnRange.Name.match(new RegExp(/SUBSET$/)) ||
        $lmnRange.Name.match(new RegExp(/SUPSET$/)) ||
        $lmnRange.Name.match(new RegExp(/PAT$/))
      ) {
        lmnRangeGroup[$lmnRange.Name] = $lmnRange
      }
      return $lmnRanges
    }, this)
    console.log(this)
  }
}