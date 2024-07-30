import EventEmitter from 'node:events'
import path from 'node:path'
import { writeFile, mkdir, stat } from 'node:fs'
import { globSync } from 'glob'
import chokidar from 'chokidar'

export default class Filesystem extends EventEmitter {
  #settings
  #_fsRoot
  fsRootPath
  #_fsRootStat
  #_fsRootWatch
  #filesystem
  #databases
   constructor($settings = {}) {
    super()
    this.#settings = $settings
    this.#filesystem = this.#settings.filesystem
    this.#databases = this.#settings.databases
    this.fsRootPath = this.#filesystem.path
    this.fsRootStat = this.fsRootPath
    this.fsRoot = this.fsRootPath
    this.fsRootWatch = this.fsRootPath
  }
  get fsRootStat() { return this.#_fsRootStat }
  set fsRootStat($fsRootPath) {
    this.#_fsRootStat = stat($fsRootPath, ($err, $fsRootStat) => {
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
    })
  }
  get fsRoot() { return this.#_fsRoot }
  set fsRoot($fsRootPath) {
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
  get fsRootWatch() { return this.#_fsRootWatch }
  set fsRootWatch($fsRootPath) {
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
  async #fsRootWatchChange($workbookPath) {
    this.fsRoot = this.fsRootPath
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
