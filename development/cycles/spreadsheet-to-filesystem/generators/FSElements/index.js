import EventEmitter from 'node:events'
import path from 'node:path'
import { mkdir, stat } from 'node:fs'
import { globSync } from 'glob'
import Added from './Added/index.js'
import Updated from './Updated/index.js'
import Deleted from './Deleted/index.js'

export default class FSElements extends EventEmitter {
  fsRoot
  fsRootPath
  fsRootStat
  // #_added
  // added
  // updated
  // deleted
   constructor(
    $filesystem, $generator
  ) {
     super()
    this.fsRootPath = $filesystem.path
    this.fsRootStat = stat(this.fsRootPath, ($err, $fsRootStat) => {
      if($err) {
        mkdir(this.fsRootPath, {
          recursive: true,
        }, ($err) => {
          if($err) return $err
        })
      }
    })
    this.fsRoot = globSync(
      path.join(this.fsRootPath, '**/*'),
      {
        dot: true,
        ignore: [
          path.join(this.fsRootPath, 'node_modules/**'),
          path.join(this.fsRootPath, '.git/**')
        ]
      }
    )
    console.log('this.fsRoot', this.fsRoot)
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
  input($collect) {
    const collectDocsLength = $collect.length
    let collectDocsIndex = 0
    while(collectDocsIndex < collectDocsLength) {
      const collectDoc = $collect[collectDocsIndex]
      console.log('collectDoc', collectDoc)
      collectDocsIndex++
    }
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
    return this
  }
}
