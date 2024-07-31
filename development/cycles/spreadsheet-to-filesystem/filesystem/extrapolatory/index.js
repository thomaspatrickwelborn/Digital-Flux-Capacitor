import EventEmitter from 'node:events'
import path from 'node:path'
import { stat } from 'node:fs'
import url from 'node:url'
import { Functions, Parsers, Operators } from './coutil/index.js'
import { writeFile, readFile } from 'node:fs'
import * as Templates from './templates/index.js'
const modulePath = path.dirname(
  url.fileURLToPath(import.meta.url)
)
export default class Extrapolatory extends EventEmitter {
  #settings
  constructor($settings = {}) {
    super()
    this.#settings = $settings
  }
  get #root() { return this.#settings.root }
  generateFileContent($collectDoc) {
    var collectDoc = $collectDoc
    if(
      collectDoc.fs.type === 'File' &&
      collectDoc.fs.template !== undefined
    ) {
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
  }
  addFile($addedFileDoc) {
    console.log('$addedFileDoc', $addedFileDoc)
    const addedFileDocPath = path.join(
      this.#root.path,
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
    console.log('$addedFoldDoc', $addedFoldDoc)
    const addedFoldDocPath = path.join(
      this.#root.path,
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
  input($fileDoc) {
    const fileDoc = $fileDoc.toObject()
    const { operations, permissions, path } = fileDoc.fs
    console.log('fileDoc', fileDoc)
    if(
      operations.add === true &&
      this.#root.includes(path) === false
    ) {
      switch(fileDoc.fs.type) {
        case 'File':
          this.addFile(fileDoc)
          break
        case 'Fold':
          this.addFold(fileDoc)
          break
      }
    } else
    if(
      operations.update === true &&
      this.#root.includes(path) === true
    ) {
      // 
    } else
    if(
      operations.delete === true &&
      this.#root.includes(path) === true
    ) {
      // 
    }
  }
}