import { fillEmptyCells } from '#utils/index.js'
import assignProps from './assignProps/index.js'
import assignLMNProps from './assignLMNProps/index.js'
const translexes = [
	["assignProps", assignProps],
	["assignLMNProps", assignLMNProps],
]

async function Supposit($settings) {
	const {
		nom, com, modIndex, mods, merges, lmnRanges
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
					modIndex, mods, sup, com, lmnRanges
				})
				break
			case 'AsyncFunction':
				supposit = await $translexisMethod(supposit, {
					modIndex, mods, sup, com, lmnRanges
				})
				break
		}
		translexesIndex++
	}
	return supposit
}

export default Supposit