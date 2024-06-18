import path from 'node:path'
import beautify from 'js-beautify'
import prettier from 'prettier'
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
				space_after_anon_function: false,
				space_after_function: false,
				max_preserve_newlines: 0,
				// operator_position: 'preserve-newline',
				end_with_newline: false,
				// templating: ["erb"],
			}
			const beautifyJSFileOptions = {
				indent_size: 2, 
				indent_char: ' ',
				preserve_newlines: false,
				space_after_conditional: false,
				space_after_anon_function: false,
				space_after_function: false,
				max_preserve_newlines: 0,
				// operator_position: 'preserve-newline',
				end_with_newline: false,
				// templating: ["erb"],
			}
			const templateModel = {
				content: collectDoc.toObject(),
				coutils: {
					isSlug,
					parseTen,
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
			let prettierFileData
			if(collectDoc.fs.template === 'es_markup') {
				prettierFileData = await prettier.format(fileData, {
					parser: 'html'
				})
			} else
			if(collectDoc.fs.template === 'es_module') {
				prettierFileData = await prettier.format(fileData, {
					parser: 'babel'
				})
			}
			console.log(
				'\n', '=====', 
				'\n', collectDoc.fs.template, filePath, 
				'\n', '#####',
				'\n', prettierFileData,
			)
			await writeFile(filePath, prettierFileData)
		}
		collectionIndex++
	}
}

export default FSElementsContent