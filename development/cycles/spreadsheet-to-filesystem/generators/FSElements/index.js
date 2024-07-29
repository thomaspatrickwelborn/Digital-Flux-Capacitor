import EventEmitter from 'node:events'
import path from 'node:path'
import { writeFile, mkdir, stat } from 'node:fs'
import { globSync } from 'glob'
import chokidar from 'chokidar'

export default class FSElements extends EventEmitter {
  #_fsRoot
  fsRootPath
  #_fsRootStat
  #_fsRootWatch
   constructor(
    $filesystem, $generator
  ) {
    super()
    this.fsRootPath = $filesystem.path
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
    this.#_fsRootWatch = chokidar.watch($fsRootPath)
    this.#_fsRootWatch.on(
      'add', this.#fsRootWatchChange.bind(this)
    )
    this.#_fsRootWatch.on(
      'unlink', this.#fsRootWatchChange.bind(this)
    )
    this.#_fsRootWatch.on(
      'addDir', this.#fsRootWatchChange.bind(this)
    )
    this.#_fsRootWatch.on(
      'unlinkDir', this.#fsRootWatchChange.bind(this)
    )
  }
  async #fsRootWatchChange($workbookPath) {
    this.fsRoot = this.fsRootPath
  }
  addFile($addedFileDoc) {
    let addedFSElementStat = stat($addedFileDoc.fs.path, (
      $err, $addedFSElementStat
    ) => {
      console.log($err, $addedFSElementStat)
      if(
        $err || 
        $addedFSElementStat.isFile() === false &&
        $addedFSElementStat.isDirectory() === false
      ) {
        writeFile($addedFileDoc.fs.path, '', ($err) => {
          console.log($err)
          if($err) return
          // this.emit('addFile', $addedFileDoc)
        })
      }
    })
  }
  addFold($addedFoldDoc) {
    let addedFSElementStat = stat($addedFoldDoc.fs.path, (
      $err, $addedFSElementStat
    ) => {
      console.log($err, $addedFSElementStat)
      if(
        $err || 
        $addedFSElementStat.isFile() === false &&
        $addedFSElementStat.isDirectory() === false
      ) {
        mkdir($addedFoldDoc.fs.path, {
          recursive: true,
        }, ($err, $dir) => {
          console.log($err)
          if($err) return
          // this.emit('addFold', $addedFoldDoc)
        })
      }
    })
  }
  inputFileDoc($fileDoc) {
    const fileDoc = $fileDoc.toObject()
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
          this.addFile(fileDoc)
          break
      }
    }
  }
}
