import EventEmitter from 'node:events'
import path from 'node:path'
import url from 'node:url'
import { Functions, Parsers, Operators } from './coutil/index.js'
import { writeFile, readFile } from 'node:fs'
import * as Templates from './templates/index.js'
const modulePath = path.dirname(
  url.fileURLToPath(import.meta.url)
)
export default class FSElementContent extends EventEmitter {
  constructor($collection, $presubcycle, $subcycle) {
    super()
    const { filesystemContent } = $subcycle.settings
    const { filesystem } = $subcycle.settings.output
    const fsDBConnection = $presubcycle.dbConnection
    const File = fsDBConnection.models['File']
    const collectionLength = $collection.length
    var collectionIndex = 0
    iterateCollection: 
    while(collectionIndex < collectionLength) {
      var collectDoc = $collection[collectionIndex]
      if(!collectDoc.fs.operations.update) {
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
          readFile(filePath, ($err, $readFileData) => {
            if($err) return
            if(writeFileData !== $readFileData) {
              writeFile(filePath, writeFileData, ($err) => {
                if($err) return
                console.log(
                  '\n', '=====', 
                  '\n', collectDoc.fs.template, filePath, 
                  '\n', '#####',
                  '\n', 'writeFileData', 
                  '\n', writeFileData, 
                )
              })
            }
          })
        }
      }
      collectionIndex++
    }
  }
}