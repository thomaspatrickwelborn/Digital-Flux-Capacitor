import { fillEmptyCells } from '#utils/index.js'
import assignProps from './assignProps/index.js'
const translexes = [
	["assignProps", assignProps],
]

async function Composit($settings = {}) {
	const {
		nom, sup, com, modIndex, mods, merges, ranges
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
						com, comRow, modIndex, mods, merges, sup, supRows
					})
					break
				case 'AsyncFunction':
					apposit = await $translexisMethod(apposit, {
						com, comRow, modIndex, mods, merges, sup, supRows
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