export default class LMNRanges extends EventTarget {
  constructor($settings) {
    super()
  }
  #lmnPropRangeRefsMatch($lmnPropRangeA, $lmnPropRangeB) {
    return (
      $lmnPropRangeA.Ref.s.r === $lmnPropRangeB.Ref.s.r &&
      $lmnPropRangeA.Ref.s.c === $lmnPropRangeB.Ref.s.c &&
      $lmnPropRangeA.Ref.e.r === $lmnPropRangeB.Ref.e.r &&
      $lmnPropRangeA.Ref.s.e === $lmnPropRangeB.Ref.s.e
    ) ? true
      : false
  }
  lmnRanges() {
    const lmnRanges = this.ranges
    .reduce(
      ($lmnRanges, $range) => {
        if($range.Name.match(/^LMN_[0-9]$/)) {
          const lmnRangeID = Number($range.Name.split('_')[1])
          $lmnRanges[lmnRangeID] = [$range.Name, {}]
        }
        return $lmnRanges
      }, []
    )
    iterateLMNRangeProp: for(const [
      $lmnRangeName, $lmnRangeProps
    ] of lmnRanges) {
      // LMN
      const lmnRegExp = new RegExp(`${$lmnRangeName}`)
      const lmn = this.ranges
      .find(($range) => $range.Name.match(lmnRegExp))
      if(lmn === undefined) continue iterateLMNRangeProp
      $lmnRangeProps['LMN'] = lmn
      // SUPSET
      const lmnSupsetRegExp = new RegExp(`^${$lmnRangeName}_SUPSET`)
      const lmnSupset = this.ranges
      .find(($range) => $range.Name.match(lmnSupsetRegExp))
      if(lmnSupset !== undefined) {
        $lmnRangeProps['SUPSET'] = {
          Name: lmnSupset.Name,
          Ref: lmnSupset.Ref,
        }
        const lmnSupsetRefMatchesLMNRef = this.#lmnPropRangeRefsMatch(lmn, lmnSupset)
        const lmnSupsetNameData = lmnSupset.Name.split('_')
        var lmnSupsetPropKey
        if(
          lmnSupsetRefMatchesLMNRef === true &&
          lmnSupsetNameData.length === 4
        ) {
          $lmnRangeProps['SUPSET'].Key = lmnSupsetNameData[3]
        } /* else if(
          lmnSupsetRefMatchesLMNRef === false &&
          lmnSupsetNameData.length === 4
        ) {
          $lmnRangeProps['SUPSET'].$Key = lmnSupsetNameData[3]
        } */ else if(
          lmnSupsetRefMatchesLMNRef === true &&
          lmnSupsetNameData.length === 3
        ) {
          $lmnRangeProps['SUPSET'].Key = LMNProps['LMN_SUPSET'].key
        }
        if(lmnSupsetPropKey !== undefined) {
        }
      }
      // SUBSET
      const lmnSubsetRegExp = new RegExp(`^${$lmnRangeName}_SUBSET`)
      const lmnSubset = this.ranges
      .find(($range) => $range.Name.match(lmnSubsetRegExp))
      if(lmnSubset !== undefined) {
        $lmnRangeProps['SUBSET'] = {
          Name: lmnSubset.Name,
          Ref: lmnSubset.Ref,
        }
        const lmnSubsetRefMatchesLMNRef = this.#lmnPropRangeRefsMatch(lmn, lmnSubset)
        const lmnSubsetNameData = lmnSubset.Name.split('_')
        var lmnSubsetPropKey
        if(
          lmnSubsetRefMatchesLMNRef === true &&
          lmnSubsetNameData.length === 4
        ) {
          $lmnRangeProps['SUBSET'].Key = lmnSubsetNameData[3]
        } /* else if(
          lmnSubsetRefMatchesLMNRef === false &&
          lmnSubsetNameData.length === 4
        ) {
          $lmnRangeProps['SUBSET'].$Key = lmnSubsetNameData[3]
        } */ else if(
          lmnSubsetRefMatchesLMNRef === true &&
          lmnSubsetNameData.length === 3
        ) {
          $lmnRangeProps['SUBSET'].Key = LMNProps['LMN_SUBSET'].key
        }
      }
      // PAT
      const lmnPatRegExp = new RegExp(`${$lmnRangeName}_PAT_`)
      const lmnPat = this.ranges
      .find(($range) => $range.Name.match(lmnPatRegExp))
      if(lmnPat !== undefined) {
        $lmnRangeProps['PAT'] = {
          Key: lmnPat.Name.replace(lmnPatRegExp, ''),
          Name: lmnPat.Name,
          Ref: lmnPat.Ref,
        }
      }
    }
    return lmnRanges
  }
}