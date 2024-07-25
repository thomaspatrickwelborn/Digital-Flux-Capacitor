import { createConnection } from 'mongoose'
import Subcycle from '#core/subcycle/index.js'
import {
	File as FileSchema,
	Fold as FoldSchema,
} from './schemata/index.js'
import * as Worksheets from './worksheets/index.js'
const Schemata = { FileSchema, FoldSchema }

class SpreadsheetDatabaseToFilesystemDatabase extends Subcycle {
	#settings
	#_dbConnection
	worksheets = new Map()
	constructor($settings) {
		super($settings)
		this.dbConnection = this.settings.output.database
	}
	get dbConnection() { return this.#_dbConnection }
	set dbConnection($database) {
		if(this.#_dbConnection === undefined) {
			const { uri, options } = $database
			this.#_dbConnection = createConnection(uri, options)
			this.#_dbConnection.once(
				'connected', function databaseConnected($event) {
					this.#setDBConnectionModels()
				}.bind(this)
			)
		}
	}
	#getDBConnectionModels() {
		return this.dbConnection.models
	}
	#setDBConnectionModels() {
		const modelNames = ['File', 'Fold']
		for(const $modelName of modelNames) {
			if(this.dbConnection.models[$modelName] === undefined) {
				this.dbConnection.model($modelName, Schemata[`${$modelName}Schema`])
			}
		}
		return this.#getDBConnectionModels()
	}
	async #deleteDBConnectionModels() {
		await this.dbConnection.dropDatabase()
		const modelNames = this.dbConnection.modelNames()
		const modelNamesLength = modelNames.length
		var modelNamesIndex = 0
		while(modelNamesIndex < modelNamesLength) {
			const modelName = modelNames[modelNamesIndex]
			await this.dbConnection.deleteModel(modelName)
			modelNamesIndex++
		}
		return this.dbConnection.models
	}
	async input($event) {
		switch($event.type) {
			case 'subcycle:output':
				// console.log($event.type, $event.subcycle)
				break
			case 'worksheet:output':
				// console.log($event.type, $event.worksheet)
				const { worksheet, subcycle } = $event
				const worksheetClassName = worksheet.className
				const worksheetCollect = [...worksheet.compository.collects.values()]
				.map(($collect) => {
					return Array.from($collect)
				}).flat()
				const worksheetTranslexis = await Worksheets[worksheetClassName](
					worksheetCollect, 
					{
						worksheet: worksheet,
						models: this.dbConnection.models,
					}
				)
				this.worksheets.set(
					worksheet.name, 
					worksheetTranslexis
				)
				this.emit('output', {
					type: 'worksheet:output',
					worksheet: worksheetTranslexis,
				})
				break
		}
		// this.emit('output', this)
	}
}
export default SpreadsheetDatabaseToFilesystemDatabase
