import { EventEmitter } from 'node:events'
import { createConnection } from 'mongoose'
import {
	File as FileSchema,
	Fold as FoldSchema,
} from './schemata/index.js'
import * as Worksheets from './worksheets/index.js'
const Schemata = { FileSchema, FoldSchema }
export default class Intrapository extends EventEmitter {
	#settings
	#options
	#dbConnections
	worksheets = new Map()
	constructor($settings = {}, $options = {}) {
		super()
		this.#settings = $settings
		this.#options = $options
		this.#dbConnections = this.#options.dbConnections
		this.#setDBConnectionModels()
		console.log('this.#settings', this.#settings)
		for(
			const $collect of this.#settings.collects.values()
		) {
			$collect.on('collect:save', async function collectSave($collect) {
				const worksheetTranslexis = new Worksheets[this.#options.className](
					$collect, 
					{
						worksheet: this.#options.worksheet,
						models: this.#dbConnections.filesystem.models,
					}
				)
				worksheetTranslexis.on(
					'saveCollectDoc',
					($collectDoc) => {
						this.emit('saveCollectDoc', $collectDoc)
					}
				)
				this.worksheets.set(
					this.#options.worksheet.name, 
					worksheetTranslexis
				)
				worksheetTranslexis.save()
				
			}.bind(this))
		}
		this.#options = $options
		this.#dbConnections = this.#dbConnections
	}
	#getDBConnectionModels() {
		return this.#dbConnections.filesystem.models
	}
	#setDBConnectionModels() {
		const modelNames = ['File', 'Fold']
		for(const $modelName of modelNames) {
			if(this.#dbConnections.filesystem.models[$modelName] === undefined) {
				this.#dbConnections.filesystem.model($modelName, Schemata[`${$modelName}Schema`])
			}
		}
		return this.#getDBConnectionModels()
	}
	async #deleteDBConnectionModels() {
		await this.#dbConnections.filesystem.dropDatabase()
		const modelNames = this.#dbConnections.filesystem.modelNames()
		const modelNamesLength = modelNames.length
		var modelNamesIndex = 0
		while(modelNamesIndex < modelNamesLength) {
			const modelName = modelNames[modelNamesIndex]
			await this.#dbConnections.filesystem.deleteModel(modelName)
			modelNamesIndex++
		}
		return this.#dbConnections.filesystem.models
	}
}