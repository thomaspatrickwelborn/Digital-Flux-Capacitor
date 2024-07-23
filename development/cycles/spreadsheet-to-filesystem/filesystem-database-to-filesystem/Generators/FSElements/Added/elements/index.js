import EventEmitter from 'node:events'
import path from 'node:path'
import { open, mkdir, stat } from 'node:fs'
export default class AddedElements extends EventEmitter {
  constructor(
    $collection, $fsRootPath, $added
  ) {
    super()
    const added = []
    // Added FS Elements
    const addedFSElements = $added
    const addedFSElementsLength = addedFSElements.length
    var addedFSElementsIndex = 0
    iterateAddedFSElementsIndex: 
    while(addedFSElementsIndex < addedFSElementsLength) {
      const addedFSElement = addedFSElements[addedFSElementsIndex]
      const addedFSElementDoc = $collection.find(($collectionDoc) => {
        return $collectionDoc.fs.path === addedFSElement.replace(
          $fsRootPath.concat('/'), ''
        )
      })
      if(!addedFSElementDoc?.fs?.operations?.add) {
        addedFSElementsIndex++
        continue iterateAddedFSElementsIndex
      }
      const addedFSElementDocPath = path.join(
        $fsRootPath, addedFSElementDoc.fs.path
      )
      const addedFSElementStat = stat(addedFSElementDocPath, (
        $err, $addedFSElementStat
      ) => {
        if($err) return
        if(
          $addedFSElementStat.isFile() === false &&
          $addedFSElementStat.isDirectory() === false
        ) {
          switch(addedFSElementDoc.fs.type) {
            case 'File':
              // const fileHandle = open(
              //   addedFSElementDocPath, 'w', async ($err) => {
              //     await fileHandle.close()
              //     console.log(this)
              //   }
              // )
              console.log('createFile')
              break
            case 'Fold':
              mkdir(addedFSElementDocPath, {
                recursive: true,
              }, ($err) => {
                console.log(this)
              })
              console.log('createFold')

              break
          }
        }
      })
      added.push(addedFSElementDoc)
      addedFSElementsIndex++
    }
  }
}