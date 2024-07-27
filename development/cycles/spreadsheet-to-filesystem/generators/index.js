import { EventEmitter } from 'node:events'
import FSElements from './FSElements/index.js'
import FSElementsContent from './FSElementContent/index.js'
export default class Generators extends EventEmitter {
	#settings
	#options
	#filesystem
	#dbConnections
	#_fsElements
	#_fsElementContent
	constructor($settings = {}) {
		super()
		this.#settings = $settings
		this.#filesystem = this.#settings.filesystem
		this.#dbConnections = this.#settings.dbConnections
	}
	fsElements($fsElements) {
		console.log(
			'Generators', 'generateFSElements', '$fsElements', $fsElements
		)
		// this.#_fsElements = new FSElements(
		// 	$fsElements, this.#filesystem
		// )
	}
	fsElementContent() {
		// this.fsElementContent = await FSElementsContent(
		// 	fsElements, $presubcycle, this
		// )
	}
}
