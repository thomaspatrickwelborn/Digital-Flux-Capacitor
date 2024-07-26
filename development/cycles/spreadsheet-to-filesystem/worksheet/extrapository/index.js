import { EventEmitter } from 'node:events'
import {
	FSElements,
	FSElementsContent,
} from './Generators/index.js'
export default class Extrapository extends EventEmitter {
	#settings
	#options
	#dbConnections
	fsElements
	fsElementsContent
	constructor($settings = {}, $options = {}) {
		super()
		this.#settings = $settings
		this.#options = $options
		this.#dbConnections = this.#options.dbConnections
		return this
	}
	async input($event) {
		switch($event.type) {
			case 'worksheet:output':
				console.log($event.type, $event.worksheet)
				break
		}
		// const fsDBConnection = $presubcycle.dbConnection
		// const { File, Fold } = fsDBConnection.models
		// const fileCollection = await File
		// .find({})
		// const foldCollection = await Fold
		// .find({})
		// const fsElements = foldCollection.concat(fileCollection)
		// this.fsElements = new FSElements(
		// 	fsElements, $presubcycle, this
		// )
		// this.fsElementsContent = await FSElementsContent(
		// 	fsElements, $presubcycle, this
		// )
	}
}
