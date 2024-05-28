import { fillEmptyCells } from '#utils/index.js'
import assignProps from './assignProps/index.js'
const translexes = [
	["assignProps", assignProps],
]

async function Supposit($settings) {
	const {
		nom, com, modIndex, mods, merges, ranges, lmnRanges
	} = $settings
	const sup = fillEmptyCells($settings.sup)
	var supposit = {}
	const translexesLength = translexes.length
	var translexesIndex = 0
	while(translexesIndex < translexesLength) {
		const [$translexisName, $translexisMethod] = translexes[translexesIndex]
		const translexisMethodType = $translexisMethod.constructor.name
		switch(translexisMethodType) {
			case 'Function':
				supposit = $translexisMethod(supposit, {
					modIndex, mods, lmnRanges, sup, com
				})
				break
			case 'AsyncFunction':
				supposit = await $translexisMethod(supposit, {
					modIndex, mods, lmnRanges, sup, com
				})
				break
		}
		translexesIndex++
	}
	return supposit
}

export default Supposit