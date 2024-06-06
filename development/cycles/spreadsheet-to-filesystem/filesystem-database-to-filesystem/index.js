import { EventEmitter } from 'node:events'
import * as Generators from './Generators/index.js'
class FilesystemDatabaseToFilesystem extends EventEmitter {
	constructor($settings) {
		super()
		this.#settings = $settings
		this.filesystem = this.#settings.filesystem
		return this
	}
	#settings
	filesystem
	async input($presubcycle) {
		const fsDBConnection = $presubcycle.dbConnection
		const { File, Fold } = fsDBConnection.models
		const { FSElements, FSElementsContent } = Generators
		const fileCollection = await File.find({})
		const foldCollection = await Fold.find({})
		const fsElements = foldCollection.concat(fileCollection)
		await FSElements(fsElements, $presubcycle, this)
		console.log('fsElements', fsElements)
		throw "Digital Flux Capacitor"
		await FSElementsContent(fsElements, $presubcycle, this)
	}
	async start() {
		return this
	}
	async stop() {
		return this
	}
}
export default FilesystemDatabaseToFilesystem