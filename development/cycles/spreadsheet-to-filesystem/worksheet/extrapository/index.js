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
	generate() {
		// this.fsElements = new FSElements(
		// 	fsElements, $presubcycle, this
		// )
		// this.fsElementsContent = await FSElementsContent(
		// 	fsElements, $presubcycle, this
		// )
	}
}
