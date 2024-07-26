import { EventEmitter } from 'node:events'
import FSElements from './FSElements/index.js'
import FSElementsContent from './FSElementsContent/index.js'
export default class Generators extends EventEmitter {
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
	generateFSElements($fsElements) {
		console.log('Generators', 'generateFSElements', '$fsElements', $fsElements)
		// this.fsElements = new FSElements(
		// 	fsElements, $presubcycle, this
		// )
		// this.fsElementsContent = await FSElementsContent(
		// 	fsElements, $presubcycle, this
		// )
	}
}
