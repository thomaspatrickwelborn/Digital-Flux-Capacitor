import path from 'node:path'
import prettier from 'prettier'
import * as PrettierPluginEJS from 'prettier-plugin-ejs'
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
			const templateModel = {
				content: collectDoc.toObject(),
				coutils: {
					isSlug,
					parseTen,
					renderFileOptions,
					templateDir,
					operators,
					reserved,
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
			console.log(
				'\n', '=====', 
				'\n', collectDoc.fs.template, filePath, 
				'\n', '#####',
				'\n', 'fileData',
				'\n', fileData,
			)
			let prettierFileData
			prettier.clearConfigCache()
			if(collectDoc.fs.template === 'es_markup') {
				console.log(await prettier.format(`<td <% if (styleData) { %>
  style="<%= styleData %>" <% } %>>
  <%= data %>
  <%= data %>
</td>`, { parser: 'html', semi: false, plugins: [PrettierPluginEJS]}))
				prettierFileData = await prettier.format(fileData, {
					semi: false,
					parser: 'html',
				})
			} else
			if(collectDoc.fs.template === 'es_module') {
				prettierFileData = await prettier.format(fileData, {
					semi: false,
					parser: 'babel',
				})
			}
			console.log(
				'\n', '=====', 
				'\n', collectDoc.fs.template, filePath, 
				'\n', '#####',
				'\n', 'prettierFileData',
				'\n', prettierFileData,
			)
			await writeFile(filePath, prettierFileData)
		}
		collectionIndex++
	}
}

export default FSElementsContent