import { EventEmitter } from 'node:events'
import { createConnection } from 'mongoose'
import {
	File as FileSchema,
	Fold as FoldSchema,
} from './schemata/index.js'
import Worksheets from './worksheets/index.js'
const Schemata = { FileSchema, FoldSchema }

class SpreadsheetDatabaseToFilesystemDatabase extends EventEmitter {
	constructor($settings) {
		super()
		this.#settings = $settings
		return this
	}
	#settings
	worksheets = new Map()
	dbConnection
	async #startDBConnection() {
		if(this.dbConnection === undefined) {
			const { uri, options } = this.#settings.database
			this.dbConnection = await createConnection(uri, options)
			.asPromise()
		}
		return this.dbConnection
	}
	async #stopDBConnection() {
		await this.dbConnection.close()
		this.dbConnection = undefined
		return this.dbConnection
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
	async input($preflux) {
		await this.#deleteDBConnectionModels()
		const models = this.#setDBConnectionModels()
		const filesystemDBConnection = this.dbConnection
		const spreadsheetDBConnection = $preflux.dbConnection
		const worksheets = await Worksheets(this.worksheets, {
			prefluxWorkbook: $preflux.workbook,
			fluxModels: models,
		})
		this.emit('output', this)
	}
	async start() {
		await this.#startDBConnection()
		this.#setDBConnectionModels()
		return this
	}
	async stop() {
		await this.#stopDBConnection()
		return this
	}
}
export default SpreadsheetDatabaseToFilesystemDatabase
