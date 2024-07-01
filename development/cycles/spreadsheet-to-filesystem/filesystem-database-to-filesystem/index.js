import { EventEmitter } from 'node:events'
import * as Generators from './Generators/index.js'
class FilesystemDatabaseToFilesystem extends EventEmitter {
	#settings
	filesystem
	filesystemContent
	fsElements
	fsElementsContent
	constructor($settings) {
		super()
		this.#settings = $settings
		const {
			filesystem, filesystemContent
		} = this.#settings
		this.filesystem = filesystem
		this.filesystemContent = filesystemContent
		return this
	}
	async input($presubcycle) {
		const fsDBConnection = $presubcycle.dbConnection
		const { File, Fold } = fsDBConnection.models
		const { FSElements, FSElementsContent } = Generators
		const fileCollection = await File
		.find({})
		const foldCollection = await Fold
		.find({})
		const fsElements = foldCollection.concat(fileCollection)
		this.fsElements = await FSElements(
			fsElements, $presubcycle, this
		)
		throw "Digital Flux Capacitor"
		this.fsElementsContent = await FSElementsContent(
			fsElements, $presubcycle, this
		)
	}
}
export default FilesystemDatabaseToFilesystem