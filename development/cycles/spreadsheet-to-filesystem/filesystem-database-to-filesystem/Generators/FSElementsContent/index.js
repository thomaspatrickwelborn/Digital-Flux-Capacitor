import beautify from 'js-beautify'
import path from 'node:path'
import url from 'node:url'
import ejs from 'ejs'
import operators from './operators/index.js'
import { writeFile } from 'node:fs/promises'

const projectPath = process.env.PWD
const modulePath = path.dirname(
	url.fileURLToPath(import.meta.url)
)

const reserved = {
	ignore: ['constructor', 'super']
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
			const templatePath = path.join(
				modulePath,
				'../../Templates',
				path.join(
					path.basename(
						collectDoc.fs.template, '.ejs'
					),
					'index.ejs'
				)
			)
			const templateModel = {
				content: collectDoc,
				coutils: {
					operators: operators,
					reserved: reserved,
				},
			}
			const fileData = await ejs.renderFile(
				templatePath, templateModel, {
					async: true,
					localsName: '$data',
					rmWhitespace: false,
					filename: true,
				}
			)
			const beautifiedFileData = beautify.js(fileData, {
				indent_size: 2, 
				indent_char: ' ',
				preserve_newlines: false,
			})
			const filePath = path.join(
				projectPath,
				$subcycle.filesystem.path,
				collectDoc.fs.path
			)
			console.log('=====')
			console.log(filePath, beautifiedFileData)
			await writeFile(filePath, beautifiedFileData)
		}
		collectionIndex++
	}
}

export default FSElementsContent