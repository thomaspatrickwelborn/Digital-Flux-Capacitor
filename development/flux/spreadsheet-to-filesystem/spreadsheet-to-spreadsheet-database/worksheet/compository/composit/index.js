import { fillEmptyCells } from '#utils/index.js'
import assignProps from './assignProps/index.js'
import assignLMNProps from './assignLMNProps/index.js'
const translexes = [
	["assignProps", assignProps],
	["assignLMNProps", assignLMNProps],
]

export default class Composit extends EventTarget {
	length = 0
	#settings = {}
	name
	#_supRows
	#_comRows
	constructor($settings = {}) {
		super()
		this.#settings = $settings
		const {
			nom, sup, com, modIndex, mods, merges, lmnRanges
		} = $settings
		this.name = nom
		this.supRows = this.sup
		this.comRows = this.com
	}
	get supRows() { return this.#_supRows }
	set supRows($supRows) { this.#_supRows = fillEmptyCells($supRows) }
	get comRows() { return this.#_comRows }
	set comRows($comRows) { this.#_comRows = $comRows }
}
/*
async function Composit($settings = {}) {
	const {
		nom, sup, com, modIndex, mods, merges, lmnRanges
	} = $settings
	this.supRows = sup
	// const supRows = fillEmptyCells(sup)
	const comRows = com
	const comRowsLength = comRows.length
	var comRowsIndex = 0
	const composit = this
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
						com, comRow, modIndex, mods, merges, sup, supRows, lmnRanges
					})
					break
				case 'AsyncFunction':
					apposit = await $translexisMethod(apposit, {
						com, comRow, modIndex, mods, merges, sup, supRows, lmnRanges
					})
					break
			}
			translexesIndex++
		}
		Array.prototype.push.call(composit, apposit)
		comRowsIndex++
	}
	return composit
}
export default Composit
*/