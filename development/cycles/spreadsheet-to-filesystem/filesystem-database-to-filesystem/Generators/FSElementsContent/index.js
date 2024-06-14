import path from 'node:path'
import beautify from 'js-beautify'
import ejs from 'ejs'
import url from 'node:url'
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
			const templateDir = path.join(
				modulePath,
				'../../Templates',
				path.basename(
					collectDoc.fs.template, '.ejs'
				)
			)
			const templatePath = path.join(
				templateDir, 'index.ejs'
			)
			const renderFileOptions = {
				async: true,
				localsName: '$data',
				rmWhitespace: false,
				filename: true,
			}
			const beautifyFileOptions = {
				indent_size: 2, 
				indent_char: ' ',
				preserve_newlines: false,
			}
			const templateModel = {
				content: collectDoc.toObject(),
				coutils: {
					renderFileOptions,
					beautifyFileOptions,
					templateDir,
					operators,
					reserved,
					beautify,
					path,
					ejs,
				}
			}
			const fileData = await ejs.renderFile(
				templatePath, templateModel, renderFileOptions
			)
			const beautifiedFileData = beautify.js(fileData, beautifyFileOptions)
			const filePath = path.join(
				projectPath,
				$subcycle.filesystem.path,
				collectDoc.fs.path
			)
			console.log(
				'=====', '\n',
				filePath, '\n', 
				beautifiedFileData
			)
			await writeFile(filePath, beautifiedFileData)
		}
		collectionIndex++
	}
}

export default FSElementsContent