import { typeOf, defaults } from '#utils/index.js'
const { LMNProps } = defaults

function assignLMNProps(apposit, $settings) {
	var { comRow, modIndex, mods, ranges, sup, lmnRanges } = $settings
	if(lmnRanges.length === 0) return apposit
	return apposit
}

export default assignLMNProps