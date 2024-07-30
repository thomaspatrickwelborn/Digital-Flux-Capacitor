import EventEmitter from 'node:events'
import path from 'node:path'
import { writeFile, mkdir, stat } from 'node:fs'
import { globSync } from 'glob'
import chokidar from 'chokidar'
import Extrapository from './extrapository/index.js'

export default class Filesystem extends EventEmitter {
  #settings
  #_fsRoot
  fsRootPath
  #_fsRootStat
  #_fsRootWatch
  #databases
  #_extrapository
   constructor($settings = {}) {
    super()
    this.#settings = $settings
    this.#databases = this.#settings.databases
    // this.fsRootPath = this.#settings.filesystem.path
    // this.fsRootStat = this.fsRootPath
    // this.fsRoot = this.fsRootPath
    // this.fsRootWatch = this.fsRootPath
    // this.extrapository = this.compository
  }
  reconstructor() {
    // this.extrapository = this.compository
  }
  get fsRootPath() {
    return this.#settings.filesystem.path
  }
  get fsRootStat() {
    this.#_fsRootStat = stat(
      this.#settings.filesystem.path,
      ($err, $fsRootStat) => {
        if($err) {
          mkdir($fsRootPath, {
            recursive: true,
          }, ($err) => {
            if($err) return $err
            this.#_fsRootStat = stat($fsRootPath)
          })
        } else {
          this.#_fsRootStat = $fsRootStat
        }
      }
    )
    return this.#_fsRootStat
  }
  get fsRoot() {
    if(this.#_fsRoot === undefined) {
      this.#_fsRoot = globSync(
        path.join($fsRootPath, '**/*'),
        {
          dot: true,
          ignore: [
            path.join($fsRootPath, 'node_modules/**'),
            path.join($fsRootPath, '.git/**')
          ]
        }
      )
      .map(($fsRootGlobPath) => {
        const fsRootGlobPath = $fsRootGlobPath.replace(
          new RegExp(`^${this.fsRootPath}/`),
          ''
        )
        return fsRootGlobPath
      })
    }
    return this.#_fsRoot
  }
  get fsRootWatch() {
    if(this.#_fsRootWatch === undefined) {
      this.#_fsRootWatch = chokidar.watch($fsRootPath, {
        ignore: [
          path.join($fsRootPath, 'node_modules/**'),
          path.join($fsRootPath, '.git/**')
        ]
      })
      this.#_fsRootWatch.on(
        'add',
        ($fsPath) => {
          this.fsRoot.unshift($fsPath)
        },
      )
      this.#_fsRootWatch.on(
        'unlink', 
        ($fsPath) => {
          const fsPathIndex = this.fsRoot.findIndex(
            ($fsRootPath) => $fsRootPath === $fsPath
          )
          if(fsPathIndex) this.fsRoot.splice(fsPathIndex, 1)
        },
      )
      this.#_fsRootWatch.on(
        'addDir', 
        ($fsPath) => {
          this.fsRoot.unshift($fsPath)
        },
      )
      this.#_fsRootWatch.on(
        'unlinkDir', 
        ($fsPath) => {
          const fsPathIndex = this.fsRoot.findIndex(
            ($fsRootPath) => $fsRootPath === $fsPath
          )
          if(fsPathIndex) this.fsRoot.splice(fsPathIndex, 1)
        },
      )
    }
    return this.#_fsRootWatch
  }
  get extrapository() {
    if(this.#_extrapository === undefined) {
      this.#_extrapository = new Extrapository({
        databases: this.#databases,
      })
      this.#_extrapository.on(
        'translexis:saveCollectDoc', 
        ($collectDoc) => {
          this.emit('extrapository:saveCollectDoc', $collectDoc)
        }
      )
      this.#_extrapository.on(
        'translexis:saveCollect', 
        ($collect) => {
          this.emit('extrapository:saveCollect', $collect)
        }
      )
      this.#_extrapository.on(
        'translexis:saveCollects', 
        ($collects) => {
          this.emit('extrapository:saveCollects', $collects)
        }
      )
    }
    return this.#_extrapository
  }
  async #fsRootWatchChange($workbookPath) {
    // this.fsRoot = this.fsRootPath
  }
  addFile($addedFileDoc) {
    const addedFileDocPath = path.join(
      this.fsRootPath,
      $addedFileDoc.fs.path,
    )
    const addedFileDirPath = path.dirname(addedFileDocPath)
    stat(addedFileDirPath, (
      $err, $addedFSElementStat
    ) => {
      if($addedFSElementStat.isDirectory() === false) {
        mkdir(addedFoldDocPath, {
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
