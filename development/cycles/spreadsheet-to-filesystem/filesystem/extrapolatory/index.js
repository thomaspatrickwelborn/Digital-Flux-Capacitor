import EventEmitter from 'node:events'
import path from 'node:path'
import url from 'node:url'
import { Functions, Parsers, Operators } from './coutil/index.js'
import { writeFile, readFile } from 'node:fs'
import * as Templates from './templates/index.js'
const modulePath = path.dirname(
  url.fileURLToPath(import.meta.url)
)
export default class Extrapolatory extends EventEmitter {
  
  addFile($addedFileDoc) {
    const addedFileDocPath = path.join(
      this.rootPath,
      $addedFileDoc.fs.path,
    )
    const addedFileDirPath = path.dirname(addedFileDocPath)
    stat(addedFileDirPath, (
      $err, $addedFileDirStat
    ) => {
      if($addedFileDirStat.isDirectory() === false) {
        mkdir(addedFileDirPath, {
          recursive: true,
        }, ($err, $dir) => {
          writeFile(addedFileDocPath, '', ($err, $file) => {
            // console.log($err, $file)
            if($err) return
            // this.emit('addFile', $addedFileDoc)
          })
        })
      } else {
        writeFile(addedFileDocPath, '', ($err, $file) => {
          // console.log($err, $file)
          if($err) return
          // this.emit('addFile', $addedFileDoc)
        })
      }
    })
  }
  addFold($addedFoldDoc) {
    const addedFoldDocPath = path.join(
      this.rootPath,
      $addedFoldDoc.fs.path,
    )
    mkdir(addedFoldDocPath, {
      recursive: true,
    }, ($err, $dir) => {
      // console.log($err, $dir)
      if($err) return
      // this.emit('addFold', $addedFoldDoc)
    })
  }
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