import { createConnection } from 'mongoose'
import Subcycle from '#core/subcycle/index.js'
import {
	File as FileSchema,
	Fold as FoldSchema,
} from './schemata/index.js'
import Worksheets from './worksheets/index.js'
const Schemata = { FileSchema, FoldSchema }

class SpreadsheetDatabaseToFilesystemDatabase extends Subcycle {
	#settings
	#_dbConnection
	worksheets = new Map()
	constructor($settings) {
		super($settings)
		this.dbConnection = this.settings.database
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
	async input($presubcycle) {
		await this.#deleteDBConnectionModels()
		const models = this.#setDBConnectionModels()
		const filesystemDBConnection = this.dbConnection
		const spreadsheetDBConnection = $presubcycle.dbConnection
		this.worksheets = new Map(await Worksheets({
			presubcycleWorkbook: $presubcycle.workbook,
			subcycleModels: models,
		}))
		this.emit('output', this)
	}
}
export default SpreadsheetDatabaseToFilesystemDatabase
