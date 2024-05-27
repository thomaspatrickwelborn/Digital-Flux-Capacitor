import { EventEmitter } from 'node:events'
import * as Generators from './Generators/index.js'
class FilesystemDatabaseToFilesystem extends EventEmitter {
	constructor($settings) {
		super()
		console.log(this)
		this.#settings = $settings
		this.filesystem = this.#settings.filesystem
		return this.#start()
	}
	#settings
	filesystem
	async #start() {
		return this
	}
	async #stop() {
		return this
	}
	async input($preflux) {
		const fsDBConnection = $preflux.dbConnection
		const { File, Fold } = fsDBConnection.models
		const { FSElements, FSElementsContent } = Generators
		const fileCollection = await File.find({})
		const foldCollection = await Fold.find({})
		const fsElements = foldCollection.concat(fileCollection)
		await FSElements(fsElements, $preflux, this)
		await FSElementsContent(fsElements, $preflux, this)
	}
}
export default FilesystemDatabaseToFilesystem