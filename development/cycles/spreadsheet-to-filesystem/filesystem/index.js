import EventEmitter from 'node:events'
import path from 'node:path'
import { writeFile, mkdir, stat } from 'node:fs'
import Extrapository from './extrapository/index.js'
import Root from './root/index.js'

export default class Filesystem extends EventEmitter {
  #settings
  #_root
  #_extrapository
   constructor($settings = {}) {
    super()
    this.#settings = $settings
  }
  get #databases() { return this.#settings.databases }
  get extrapository() {
    if(this.#_extrapository === undefined) {
      this.#_extrapository = new Extrapository({
        databases: this.#databases,
      })
      this.#_extrapository.on(
        'saveCollectDoc', 
        ($collectDoc) => {
          // <<<<<<<<<<<<>>>>>>>>>>>>
          console.log('saveCollectDoc', $collectDoc)
          // this.emit('extrapository:saveCollectDoc', $collectDoc)
        }
      )
    }
    return this.#_extrapository
  }
  get root() {
    if(this.#_root === undefined) {
      this.#_root = new Root(
        this.#settings.filesystem
      )
    }
    return this.#_root
  }
  addFile($addedFileDoc) {
    const addedFileDocPath = path.join(
      this.fsRootPath,
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
      this.fsRootPath,
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
  inputFileDoc($fileDoc) {
    const fileDoc = $fileDoc.toObject()
    console.log('inputFileDoc', fileDoc)
    const { operations, permissions, path } = fileDoc.fs
    if(
      operations.add === true &&
      this.fsRoot.includes(path) === false
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
      this.fsRoot.includes(path) === true
    ) {
      // 
    } else
    if(
      operations.delete === true &&
      this.fsRoot.includes(path) === true
    ) {
      // 
    }
  }
}
