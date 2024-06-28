import path from 'node:path'
import url from 'node:url'
import { Functions, Parsers, Operators } from '../Coutil/index.js'
import { writeFile } from 'node:fs/promises'
import * as Templates from '../../Templates/index.js'
const projectPath = process.env.PWD
const modulePath = path.dirname(
	url.fileURLToPath(import.meta.url)
)

async function FSElementsContent(
	$collection, $presubcycle, $subcycle
) {
	const {
		filesystem, filesystemContent
	} = $subcycle
	const fsDBConnection = $presubcycle.dbConnection
	const File = fsDBConnection.models['File']
	const collectionLength = $collection.length
	var collectionIndex = 0
	iterateCollection: 
	while(collectionIndex < collectionLength) {
		var collectDoc = $collection[collectionIndex]
		if(collectDoc.fs.operations.update === false) {
			collectionIndex++
			continue iterateCollection
		}
		if(collectDoc.fs.type === 'File') {
			if(collectDoc.fs.template === undefined) {
				collectionIndex++
				continue iterateCollection
			}
			const templateModel = {
				content: collectDoc.toObject(),
				coutils: {
					Functions,
					Parsers,
					Operators,
					path,
				}
			}
			const filePath = path.join(
				projectPath,
				filesystem.path,
				collectDoc.fs.path
			)
			console.log(collectDoc.fs.template)
			const Template = Templates[
				collectDoc.fs.template
			]
			if(Template) {
				const TemplateOptions = filesystemContent[
					collectDoc.fs.template
				]
				const fileData = Template(templateModel, TemplateOptions)
				console
				.log(
					'\n', '=====', 
					'\n', collectDoc.fs.template, filePath, 
					'\n', '#####',
					'\n', 'fileData',
					'\n', fileData,
				)
				await writeFile(filePath, fileData)
			}
		}
		collectionIndex++
	}
}

export default FSElementsContent