import { fillEmptyCells } from '#utils/index.js'
const translexes = [
	["assignProps", await import(
		"./assignProps/index.js"
	).then($module => $module.default)],
	["assignLMNProps", await import(
		"./assignLMNProps/index.js"
	).then($module => $module.default)],
]

async function Composit($settings = {}) {
	const {
		nom, sup, com, modIndex, mods, merges, ranges, lmnRanges
	} = $settings
	const supRows = fillEmptyCells(sup)
	const comRows = com
	const comRowsLength = comRows.length
	var comRowsIndex = 0
	const composit = []
	while(comRowsIndex < comRowsLength) {
		const comRow = comRows[comRowsIndex]
		var apposit = {}
		const translexesLength = translexes.length
		var translexesIndex = 0
		while(translexesIndex < translexesLength) {
			const [$translexisName, $translexisMethod] = translexes[translexesIndex]
			const translexisMethodType = $translexisMethod.constructor.name
			switch(translexisMethodType) {
				case 'Function':
					apposit = $translexisMethod(apposit, {
						com, comRow, modIndex, mods, merges, lmnRanges, sup, supRows
					})
					break
				case 'AsyncFunction':
					apposit = await $translexisMethod(apposit, {
						com, comRow, modIndex, mods, merges, lmnRanges, sup, supRows
					})
					break
			}
			translexesIndex++
		}
		composit.push(apposit)
		comRowsIndex++
	}
	return composit
}
export default Composit