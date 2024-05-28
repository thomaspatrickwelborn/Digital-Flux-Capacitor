import beautify from 'js-beautify'
import path from 'node:path'
import url from 'node:url'
import ejs from 'ejs'
import { asyncWriteFile } from '#utils/index.js'
// import * as Templates from '../../Templates/index.js'
const projectPath = process.env.PWD
const modulePath = path.dirname(
	url.fileURLToPath(import.meta.url)
)

const operators = {
  closure: ["{}", "[]", "()", "<>"],
  assignment: [":", "?", "=", "+=", "-=", "++", "--"],
  mathematical: ["+", "-", "*", "/", "%"],
  comparison: ["<", ">", "<=", "=>", "==", "!=","===", "!=="],
	operatorTypes: ['closure', 'assignment', 'mathematical', 'comparison'],
  getType: function($operator) {
  	var operatorType
  	for(const $operatorType of this.operatorTypes) {
  		const operatorTypeIndex = this[$operatorType].findIndex(
  			($operatorString) => $operator === $operatorString
			)
  		if(operatorTypeIndex !== -1) {
  			operatorType = $operatorType
  			break
  		}
  	}
  	return operatorType
  },
}
const reserved = {
	ignore: ['constructor', 'super']
}

async function FSElementsContent($collection, $preflux, $flux) {
	const fsDBConnection = $preflux.dbConnection
	const File = fsDBConnection.models['File']
	const collectionLength = $collection.length
	var collectionIndex = 0
	while(collectionIndex < collectionLength) {
		var collectionDoc = $collection[collectionIndex].toObject({ minimize: false })
		if(collectionDoc.fs.operations.update === false) {
			collectionIndex++
			continue
		}
		if(collectionDoc.fs.type === 'File') {
			if(collectionDoc.fs.template === undefined) {
				collectionIndex++
				continue
			}
			const fileDoc = await File.find({'fs.id': collectionDoc.fs.id })
			const templatePath = path.join(
				modulePath,
				'../../Templates',
				path.join(
					path.basename(
						collectionDoc.fs.template, '.ejs'
					),
					'index.ejs'
				)
			)
			// const Template = Templates[collectionDoc.fs.template]
			// console.log(Template)
			const templateModel = {
				file: collectionDoc,
				fileImports: collectionDoc.data.import,
				fileExports: collectionDoc.data.export,
				fileBlocks: collectionDoc.data.blocks,
				operators: operators,
				reserved: reserved,
			}
			console.log(templateModel)
			/*
			const fileData = await ejs.renderFile(templatePath, templateModel, {
				async: true,
				localsName: '$data',
				rmWhitespace: false,
				filename: true,
			})
			const beautifiedFileData = beautify.js(fileData, {
				indent_size: 2, 
				indent_char: ' ',
				preserve_newlines: false,
			})
			const filePath = path.join(
				projectPath,
				$flux.filesystem.path,
				collectionDoc.fs.path
			)
			await asyncWriteFile(filePath, beautifiedFileData)
			*/
		}
		collectionIndex++
	}
}

export default FSElementsContent