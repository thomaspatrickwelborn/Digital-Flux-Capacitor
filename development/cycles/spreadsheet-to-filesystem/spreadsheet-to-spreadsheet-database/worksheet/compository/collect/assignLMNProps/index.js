import assignProps from './assignProps.js'
import assignPropPath from './assignPropPath.js'

async function assignLMNProps($collect, $settings) {
	var { mods, ranges, composits, lmnRanges } = $settings
	if(lmnRanges.length === 0) return $collect
	assignProps($collect, { mods, lmnRanges, composits })
	assignPropPath($collect, { mods, lmnRanges, composits })
	return $collect
}

export default assignLMNProps