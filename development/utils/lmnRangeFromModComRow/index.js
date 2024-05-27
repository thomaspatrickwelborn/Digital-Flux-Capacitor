function lmnRangeFromModComRow($lmnRanges, $modComRow) {
	var lmnRange
	var lmnRangeIndex
	for(const [
		$lmnRangeName, $lmnRange
	] of $lmnRanges) {
		const { LMN } = $lmnRange
		const lmnRangeSlice = $modComRow
		.slice(
			LMN.Ref.s.c, LMN.Ref.e.c + 1
		)
		const lmnRangeValIndex = lmnRangeSlice
		.findIndex(
			($lmnRangeVal) => $lmnRangeVal !== undefined
		)
		if(lmnRangeValIndex !== -1) {
			lmnRangeIndex = lmnRangeValIndex
			lmnRange = $lmnRange
			break
		}
	}
	return [lmnRangeIndex, lmnRange]
}

export default lmnRangeFromModComRow