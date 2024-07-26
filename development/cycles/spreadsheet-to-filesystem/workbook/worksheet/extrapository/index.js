import { EventEmitter } from 'node:events'
import { createConnection } from 'mongoose'
import {
	File as FileSchema,
	Fold as FoldSchema,
} from './schemata/index.js'
import * as Translexes from './translexes/index.js'
const Schemata = { FileSchema, FoldSchema }
export default class Extrapository extends EventEmitter {
	#_compository
	get #compository() { return this.#_compository }
	set #compository($compository) {
		this.#_compository = $compository
		this.#_compository.on(
			'collect:save',
			this.#compositoryCollectSave.bind(this)
		)
	}
	#options
	#dbConnections
	translexes = new Map()
	constructor($compository = {}, $options = {}) {
		super()
		this.#compository = $compository
		this.#options = $options
		this.#dbConnections = this.#options.dbConnections
		this.#setDBConnectionModels()
	}
	async #compositoryCollectSave($collect) {
		const worksheetTranslexis = new Translexes[
			this.#options.className
		](
			$collect, 
			{
				worksheet: this.#options.worksheet,
				models: this.#dbConnections.filesystem.models,
			}
		)
		worksheetTranslexis.on(
			'saveCollectDoc',
			($collectDoc) => {
				this.emit('translexis:saveCollectDoc', $collectDoc)
			}
		)
		worksheetTranslexis.on(
			'saveCollect',
			($collect) => {
				this.emit('translexis:saveCollect', $collect)
			}
		)
		this.translexes.set(
			this.#options.worksheet.name, 
			worksheetTranslexis
		)
		worksheetTranslexis.save()
		
	}
	#getDBConnectionModels() {
		return this.#dbConnections.filesystem.models
	}
	#setDBConnectionModels() {
		const modelNames = ['File', 'Fold']
		for(const $modelName of modelNames) {
			if(
				this.#dbConnections.filesystem
				.models[$modelName] === undefined
			) {
				this.#dbConnections.filesystem.model(
					$modelName, 
					Schemata[`${$modelName}Schema`]
				)
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