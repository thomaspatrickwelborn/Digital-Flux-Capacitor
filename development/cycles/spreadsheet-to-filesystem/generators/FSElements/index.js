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
  added
  updated
  deleted
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
  input($collection) {
    console.log('FSElements.input', '$collection', $collection)
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
