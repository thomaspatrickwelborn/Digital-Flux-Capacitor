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
	generate($data) {
		console.log('Generators', 'generate', '$data', $data)
		// this.fsElements = new FSElements(
		// 	fsElements, $presubcycle, this
		// )
		// this.fsElementsContent = await FSElementsContent(
		// 	fsElements, $presubcycle, this
		// )
	}
}
