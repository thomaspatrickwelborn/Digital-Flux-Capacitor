import assignLMNProps from './assignLMNProps/index.js'
const Translexes = [
	["assignLMNProps", assignLMNProps],
]

export default class Collect extends EventTarget {
	length = 0
	#settings = {}
	// #dbConnection
	constructor($settings) {
		super()
		this.#settings = $settings
		// this.#dbConnection = this.#settings.dbConnection
		var collect = this
		const {
			mods, composits, dbConnection, lmnRanges
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
			const Model = dbConnection.models[nom]
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
			const [$translexisName, $translexisMethod] = translexes[translexesIndex]
			const translexisMethodType = $translexisMethod.constructor.name
			collect = $translexisMethod(collect, {
				mods: mods, lmnRanges, composits
			})
			translexesIndex++
		}
		const collectDocsLength = collect.length
		var collectDocsIndex = 0
		while(collectDocsIndex < collectDocsLength) {
			var collectDoc = collect[collectDocsIndex]
			.save({
				validateBeforeSave: false,
			}).then(() => {
				Array.prototype.splice.call(
					collect, collectDocsIndex, collectDocsIndex + 1, collectDoc
				)
			})
			collectDocsIndex++
		}
	}
}
