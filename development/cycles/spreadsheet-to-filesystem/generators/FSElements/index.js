import EventEmitter from 'node:events'
import path from 'node:path'
import { mkdir, stat } from 'node:fs'
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
  add() {
    let addedFSElementStat = stat(addedFSElementDocPath, (
      $err, $addedFSElementStat
    ) => {
      if(
        $err || 
        $addedFSElementStat.isFile() === false &&
        $addedFSElementStat.isDirectory() === false
      ) {
        switch(addedFSElementDoc.fs.type) {
          case 'File':
            writeFile(addedFSElementDoc, '', ($err) => {
              if($err) return
              this.emit('added:file', addedFSElementDoc)
            })
            break
          case 'Fold':
            mkdir(addedFSElementDocPath, {
              recursive: true,
            }, ($err, $dir) => {
              if($err) return
              this.emit('added:fold', addedFSElementDoc)
            })
            break
        }
      }
    })
  }
  inputFileDoc($fileDoc) {
    const fileDoc = $fileDoc.toObject()
    const { operations, permissions, path } = fileDoc.fs
    // console.log('path', path)
    // console.log('fsRoot', this.fsRoot)
    console.log('operations', operations)
    if(
      operations.add === true &&
      this.fsRoot.includes(path) === false
    ) {
      console.log('fileDoc', fileDoc)
    }
    // if(this.fsRoot.includes($fil))
    
  }
  // get added() { return this.#_added }
  // set added($added) {
  //   // 
  // }
  // get updated() { return this.#_updated }
  // set updated($updated) {
  //   // 
  // }
  // get deleted() { return this.#_deleted }
  // set deleted($deleted) {
  //   // 
  // }

  // input($collect) {
    // const collectDocsLength = $collect.length
    // let collectDocsIndex = 0
    // while(collectDocsIndex < collectDocsLength) {
    //   const collectDoc = $collect[collectDocsIndex]
    //   console.log('collectDoc', collectDoc)
    //   collectDocsIndex++
    // }
    // for(const $collectDoc of Object.values($collect)) {
    //   console.log('$collectDoc', $collectDoc)
    // }
    // const fsVine = $collection.reduce(
    //   ($fsVine, $collectionDoc) => {
    //     if($collectionDoc.fs.path === undefined) return $fsVine
    //     $fsVine.push(
    //       path.join(fsRootPath, $collectionDoc.fs.path)
    //     )
    //     return $fsVine
    //   }, []
    // )
    // const added = new Added({
    //   collection: $collection, 
    //   fs: {
    //     rootPath: fsRootPath,
    //     root: fsRoot,
    //     vine: fsVine
    //   }
    // })
    // added.on('added:fold', ($addedFold) => {
    //   console.log('added:fold', $addedFold)
    // })
    // const updated = await Updated(
    //   $collection, fsRootPath, fsRoot, fsVine
    // )
    // const deleted = await Deleted(
    //   $collection, fsRootPath, fsRoot, fsVine
    // )
    // return $collection
    //   return this
  // }
}
