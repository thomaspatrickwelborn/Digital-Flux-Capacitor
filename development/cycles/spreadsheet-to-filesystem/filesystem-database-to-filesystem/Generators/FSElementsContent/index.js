import path from 'node:path'
import url from 'node:url'
import { parse, isSlug, parseTen, operators } from '../Coutils/index.js'
import { writeFile } from 'node:fs/promises'
import * as Templates from '../../Templates/index.js'
const projectPath = process.env.PWD
const modulePath = path.dirname(
	url.fileURLToPath(import.meta.url)
)

async function FSElementsContent(
	$collection, $presubcycle, $subcycle
) {
	const fsDBConnection = $presubcycle.dbConnection
	const File = fsDBConnection.models['File']
	const collectionLength = $collection.length
	var collectionIndex = 0
	while(collectionIndex < collectionLength) {
		var collectDoc = $collection[collectionIndex]
		if(collectDoc.fs.operations.update === false) {
			collectionIndex++
			continue
		}
		if(collectDoc.fs.type === 'File') {
			if(collectDoc.fs.template === undefined) {
				collectionIndex++
				continue
			}
			const templateModel = {
				content: collectDoc.toObject(),
				coutils: {
					isSlug,
					parseTen,
					parse,
					operators,
					path,
				}
			}
			const filePath = path.join(
				projectPath,
				$subcycle.filesystem.path,
				collectDoc.fs.path
			)
			const Template = Templates[collectDoc.fs.template]
			const fileData = Template(templateModel)
			console.log(
				'\n', '=====', 
				'\n', collectDoc.fs.template, filePath, 
				'\n', '#####',
				'\n', 'fileData',
				'\n', fileData
				      .flat(100)
				      .filter(($fileData) => $fileData)
				      // .join(''),
			)
			throw "Digital Flux Capacitor"
			// await writeFile(filePath, prettierFileData)
		}
		collectionIndex++
	}
}

export default FSElementsContent