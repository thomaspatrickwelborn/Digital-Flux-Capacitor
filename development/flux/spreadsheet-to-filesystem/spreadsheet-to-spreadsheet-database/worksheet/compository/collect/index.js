const Translexes = [
	// ["assignLMNProps", await import(
	// 	"./assignLMNProps/index.js"
	// ).then($module => $module.default)],
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
		console.log(dbConnection)
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
			console.log(dbConnection.models)
			const Model = dbConnection.models[nom]
			const collectRows = $composit
			const collectRowsLength = collectRows.length
			var collectRowsIndex = 0
			iterateCollectRows:
			while(collectRowsIndex < collectRowsLength) {
				const collectRow = collectRows[collectRowsIndex]
				const collectDoc = new Model(collectRow)
				Array.prototype.push.call(collect, collectDoc.save())
				collectRowsIndex++
			}
			modsIndex++
		}
		// const translexes = Translexes
		// const translexesLength = translexes.length
		// var translexesIndex = 0
		// while(translexesIndex < translexesLength) {
		// 	const [$translexisName, $translexisMethod] = translexes[translexesIndex]
		// 	const translexisMethodType = $translexisMethod.constructor.name
		// 	switch(translexisMethodType) {
		// 		case 'Function':
		// 			collect = $translexisMethod(collect, {
		// 				mods: mods, lmnRanges, composits
		// 			})
		// 			break
		// 		case 'AsyncFunction':
		// 			collect = await $translexisMethod(collect, {
		// 				mods: mods, lmnRanges, composits
		// 			})
		// 			break
		// 	}
		// 	translexesIndex++
		// }
		// const collectDocsLength = collect.length
		// var collectDocsIndex = 0
		// while(collectDocsIndex < collectDocsLength) {
		// 	var collectDoc = await collect[collectDocsIndex]
		// 	.save({
		// 		validateBeforeSave: false,
		// 	})
		// 	collectDocsIndex++
		// }
		// return collect
	}
}
