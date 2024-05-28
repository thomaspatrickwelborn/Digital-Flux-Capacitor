import { fillEmptyCells } from '#utils/index.js'
const translexes = [
	["assignProps", await import(
		"./assignProps/index.js"
	).then($module => $module.default)],
	["assignLMNProps", await import(
		"./assignLMNProps/index.js"
	).then($module => $module.default)],
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
	console.log($settings)
		translexesIndex++
	}
	return supposit
}

export default Supposit