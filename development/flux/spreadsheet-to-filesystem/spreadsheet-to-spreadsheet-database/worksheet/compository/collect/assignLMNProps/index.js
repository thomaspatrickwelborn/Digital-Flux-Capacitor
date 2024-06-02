import assignProps from './assignProps.js'
import assignPropPath from './assignPropPath.js'

async function assignLMNProps($collect, $settings) {
	var { mods, ranges, composits, lmnRanges } = $settings
	if(lmnRanges.length === 0) return $collect
	$collect = assignProps($collect, { mods, lmnRanges, composits })
	// $collect = assignPropPath($collect, { mods, lmnRanges, composits })
	return $collect
}

export default assignLMNProps