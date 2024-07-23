import { EventEmitter } from 'node:events'
import {
	FSElements,
	FSElementsContent,
} from './Generators/index.js'
class FilesystemDatabaseToFilesystem extends EventEmitter {
	settings
	fsElements
	fsElementsContent
	constructor($settings) {
		super()
		this.settings = $settings
		return this
	}
	async input($presubcycle) {
		const fsDBConnection = $presubcycle.dbConnection
		const { File, Fold } = fsDBConnection.models
		const fileCollection = await File
		.find({})
		const foldCollection = await Fold
		.find({})
		const fsElements = foldCollection.concat(fileCollection)
		this.fsElements = new FSElements(
			fsElements, $presubcycle, this
		)
		// this.fsElementsContent = await FSElementsContent(
		// 	fsElements, $presubcycle, this
		// )
	}
}
export default FilesystemDatabaseToFilesystem