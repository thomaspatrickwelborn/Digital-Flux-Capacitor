import { Timer } from '#utils/index.js'
import { EventEmitter } from 'node:events'
import assignLMNProps from './assignLMNProps/index.js'
const Translexes = [
	["assignLMNProps", assignLMNProps],
]

export default class Collect extends EventEmitter {
	length = 0
	#settings = {}
	constructor($settings) {
		super()
		this.#settings = $settings
		var collect = this
		const {
			mods, composits, dbConnections, lmnRanges
		} = $settings
		const modsLength = mods.length
		var modsIndex = 0
		iterateMods: 
		while(modsIndex < modsLength) {
			const {
				nom, sup, com
			} = mods[modsIndex][1]
			const [
				$compositIndex, $composit
			] = composits[modsIndex]
			const Model = dbConnections.spreadsheet.models[nom]
			const collectRows = $composit
			const collectRowsLength = collectRows.length
			var collectRowsIndex = 0
			iterateCollectRows:
			while(collectRowsIndex < collectRowsLength) {
				const collectRow = collectRows[collectRowsIndex]
				const collectDoc = new Model(collectRow)
				Array.prototype.push.call(collect, collectDoc)
				collectRowsIndex++
			}
			modsIndex++
		}
		const translexes = Translexes
		const translexesLength = translexes.length
		var translexesIndex = 0
		while(translexesIndex < translexesLength) {
			const [
				$translexisName, $translexisMethod
			] = translexes[translexesIndex]
			const translexisMethodType = $translexisMethod.constructor.name
			$translexisMethod(collect, {
				mods, lmnRanges, composits
			})
			translexesIndex++
		}
	}
	async save() {
		const collectDocsLength = this.length
		var collectDocsIndex = 0
		// const collectDocsSaveTimer = new Timer({
		// 	name: 'collectDocsSaveTimer'
		// }).start()
		while(collectDocsIndex < collectDocsLength) {
			// const collectDocSaveTimer = new Timer({
			// 	name: 'collectDocSaveTimer'
			// }).start()
			await this[collectDocsIndex]
			.save({
				validateBeforeSave: false,
			})
			// collectDocSaveTimer.stop().log()
			collectDocsIndex++
		}
		// console.log(this)
		this.emit(
			'collect:save', 
			this
		)
		// collectDocsSaveTimer.stop().log()
		return this
	}
}
