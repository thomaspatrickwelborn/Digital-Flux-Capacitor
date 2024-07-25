import EventEmitter from 'node:events'
import path from 'node:path'
import {
  open, opendir, stat, close, mkdir
} from 'node:fs'
export default class AddedElements extends EventEmitter {
  length = 0
  constructor($settings = {}) {
    super()
    const {
      collection, fs, addedDiff
    } = $settings
    const added = this
    // Added FS Elements
    const addedFSElements = addedDiff
    const addedFSElementsLength = addedFSElements.length
    var addedFSElementsIndex = 0
    iterateAddedFSElementsIndex: 
    while(addedFSElementsIndex < addedFSElementsLength) {
      const addedFSElement = addedFSElements[addedFSElementsIndex]
      const addedFSElementDoc = collection.find(($collectionDoc) => {
        return $collectionDoc.fs.path === addedFSElement.replace(
          fs.rootPath.concat('/'), ''
        )
      })
      if(!addedFSElementDoc?.fs?.operations?.add) {
        addedFSElementsIndex++
        continue iterateAddedFSElementsIndex
      }
      let addedFSElementDocPath = path.join(
        fs.rootPath, addedFSElementDoc.fs.path
      )
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
      Array.prototype.push.call(added, addedFSElementDoc)
      addedFSElementsIndex++
    }
  }
}