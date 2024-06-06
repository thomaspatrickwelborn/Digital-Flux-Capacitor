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
		console.log($presubcycle)
		throw "Digital Flux Capacitor"
		const fsDBConnection = $presubcycle.dbConnection
		const { File, Fold } = fsDBConnection.models
		const { FSElements, FSElementsContent } = Generators
		const fileCollection = await File.find({})
		const foldCollection = await Fold.find({})
		const fsElements = foldCollection.concat(fileCollection)
		await FSElements(fsElements, $presubcycle, this)
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