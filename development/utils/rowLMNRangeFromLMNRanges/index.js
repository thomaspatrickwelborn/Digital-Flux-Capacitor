function rowLMNRangeFromLMNRanges($row, $lmnRanges) {
	var rowLMNRangeIndex, rowLMNRange
	var lmnRange
	iterateLMNRanges: for(const [$lmnRangeName, $lmnRange] of $lmnRanges) {
		rowLMNRange = $row.slice(
			$lmnRange['LMN'].Ref.s.c, $lmnRange['LMN'].Ref.e.c + 1
		)
		rowLMNRangeIndex = rowLMNRange.findIndex(
			($rowLMNRangeVal) => $rowLMNRangeVal !== undefined
		)
		if(rowLMNRangeIndex === -1) {
			continue iterateLMNRanges
		} else {
			lmnRange = $lmnRange
			break iterateLMNRanges
		}
	}
	return {
		rowLMNRangeIndex,
		rowLMNRange,
		lmnRange
	}
}

export default rowLMNRangeFromLMNRanges