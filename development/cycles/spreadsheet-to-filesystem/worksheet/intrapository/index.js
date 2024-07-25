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
		for(
			const $collect of this.#settings.collects.values()
		) {
			$collect.on('collect:save', async ($collect) => {
				console.log('collect:save', $collect)
				const worksheetTranslexis = await Worksheets[worksheetClassName](
					worksheetCollect, 
					{
						worksheet: worksheet,
						models: this.dbConnection.models,
					}
				)
				console.log('worksheetTranslexis', worksheetTranslexis)
				// this.worksheets.set(
				// 	worksheet.name, 
				// 	worksheetTranslexis
				// )
			})
		}
		// this.#settings.on(

		// )
		this.#options = $options
		this.dbConnections = this.#options.dbConnections
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
		// const { worksheet, subcycle } = $event
		// const worksheetClassName = worksheet.className
		// const worksheetCollect = [...worksheet.compository.collects.values()]
		// .map(($collect) => {
		// 	return Array.from($collect)
		// }).flat()
		// const worksheetTranslexis = await Worksheets[worksheetClassName](
		// 	worksheetCollect, 
		// 	{
		// 		worksheet: worksheet,
		// 		models: this.dbConnection.models,
		// 	}
		// )
		// this.worksheets.set(
		// 	worksheet.name, 
		// 	worksheetTranslexis
		// )
		// this.emit('output', {
		// 	type: 'worksheet:output',
		// 	worksheet: worksheetTranslexis,
		// })
	}
}