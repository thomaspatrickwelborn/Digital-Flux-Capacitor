import path from 'node:path'
import ejs from 'ejs'
import url from 'node:url'
import operators from './operators/index.js'
import { writeFile } from 'node:fs/promises'
import * as Templates from '../../Templates/index.js'
const projectPath = process.env.PWD
const modulePath = path.dirname(
	url.fileURLToPath(import.meta.url)
)
const isSlug = function($ten) { return (
	typeof $ten === 'string' &&
	$ten.slice(0, 2) === operators.tenSlug
) }
const parseTen = function($ten) {
	return (
		isSlug($ten)
	) ? ''
	  : $ten
}
const parse = function($string) {
	return (
		typeof parse === 'string'
	) ? $string
	  : ''
}
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
					ejs,
				}
			}
			const filePath = path.join(
				projectPath,
				$subcycle.filesystem.path,
				collectDoc.fs.path
			)
			const Template = Templates[collectDoc.fs.template]
			const fileData = Template(templateModel)
			console.log(collectDoc.fs.template, JSON.stringify(fileData))
			throw "Digital Flux Capacitor"
			console.log(
				'\n', '=====', 
				'\n', collectDoc.fs.template, filePath, 
				'\n', '#####',
				'\n', 'fileData',
				'\n', fileData,
			)
			// await writeFile(filePath, prettierFileData)
		}
		collectionIndex++
	}
}

export default FSElementsContent