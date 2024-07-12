import path from 'node:path'
import { stat } from 'node:fs/promises'
import url from 'node:url'
import { Functions, Parsers, Operators } from '../Coutil/index.js'
import { writeFile, readFile } from 'node:fs/promises'
import * as Templates from '../../Templates/index.js'
// const projectPath = process.env.PWD
const modulePath = path.dirname(
	url.fileURLToPath(import.meta.url)
)

async function FSElementsContent(
	$collection, $presubcycle, $subcycle
) {
	const { filesystemContent } = $subcycle.settings
	const { filesystem } = $subcycle.settings.output
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
				// projectPath,
				filesystem.path,
				collectDoc.fs.path
			)
			const Template = Templates[
				collectDoc.fs.template
			]
			if(Template) {
				const TemplateOptions = filesystemContent[
					collectDoc.fs.template
				]
				const writeFileData = Template(templateModel, TemplateOptions)
				const readFileStat = await stat(filePath)
				const readFileData = await readFile(filePath) || ''
				.then(($fileBuffer) => $fileBuffer.toString())
				// console.log(
				// 	'\n', '=====', 
				// 	'\n', collectDoc.fs.template, filePath, 
				// 	'\n', '#####',
				// 	'\n', 'writeFileData', 
				// 	'\n', writeFileData, 
				// )
				if(writeFileData !== readFileData) {
					await writeFile(filePath, writeFileData)
				}
			}
		}
		collectionIndex++
	}
}

export default FSElementsContent