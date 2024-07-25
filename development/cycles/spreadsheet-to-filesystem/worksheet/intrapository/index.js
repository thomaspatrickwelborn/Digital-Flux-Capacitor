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
	#dbConnections
	worksheets = new Map()
	constructor($settings) {
		super($settings)
		// this.dbConnections = this.settings.output.database
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