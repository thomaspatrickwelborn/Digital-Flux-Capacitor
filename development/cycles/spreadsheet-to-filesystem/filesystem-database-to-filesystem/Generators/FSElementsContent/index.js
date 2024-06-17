import path from 'node:path'
import beautify from 'js-beautify'
import * as prettier from 'prettier'
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
				rmWhitespace: true,
				filename: true,
			}
			const beautifyHTMLFileOptions = {
				indent_size: 2, 
				indent_char: ' ',
				preserve_newlines: false,
				space_after_conditional: false,
				max_preserve_newlines: 0,
				end_with_newline: false,
				templating: ["erb"],
			}
			const beautifyJSFileOptions = {
				indent_size: 2, 
				indent_char: ' ',
				preserve_newlines: false,
				space_after_conditional: false,
				max_preserve_newlines: 0,
				end_with_newline: false,
				templating: ["erb"],
			}
			const prettierFileOptions = {
				parser: "babel"
			}
			const templateModel = {
				content: collectDoc.toObject(),
				coutils: {
					renderFileOptions,
					beautifyHTMLFileOptions,
					beautifyJSFileOptions,
					templateDir,
					operators,
					reserved,
					beautify,
					path,
					ejs,
				}
			}
			const filePath = path.join(
				projectPath,
				$subcycle.filesystem.path,
				collectDoc.fs.path
			)
			const fileData = await ejs.renderFile(
				templatePath, templateModel, renderFileOptions
			)
			let beautifiedFileData
			if(collectDoc.fs.template === 'es_markup') {
				// beautifiedFileData = beautify.js(fileData, beautifyJSFileOptions)
				beautifiedFileData = beautify.html(fileData, beautifyHTMLFileOptions)
				// console.log('beautifiedFileData', beautifiedFileData)
				// const regExp = /(?=<%)[\s\S]*?(?<=%>)/g
				// console.log(beautifiedFileData.match(
				// 	new RegExp(regExp)
				// ))
			} else
			if(collectDoc.fs.template === 'es_module') {
				beautifiedFileData = beautify.js(fileData, beautifyJSFileOptions)
				// beautifiedFileData = beautify.html(fileData, beautifyJSFileOptions)
			}
			// const prettierFileData = await prettier.format(fileData, {})
			console.log(
				'\n', '=====', 
				'\n', collectDoc.fs.template, filePath, 
				// '\n', '-----',
				// '\n', fileData, 
				'\n', '#####',
				'\n', beautifiedFileData, 
				// '\n', '#####',
			// 	// '\n', prettierFileData
			)
			// await writeFile(filePath, fileData)
			// await writeFile(filePath, beautifiedFileData)
			// await writeFile(filePath, prettierFileData)
		}
		collectionIndex++
	}
}

export default FSElementsContent