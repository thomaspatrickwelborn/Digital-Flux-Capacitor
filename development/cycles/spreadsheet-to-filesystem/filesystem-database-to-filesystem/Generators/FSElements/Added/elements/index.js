import path from 'node:path'
import { open, mkdir } from 'node:fs/promises'
export default async function AddedElements($collection, $fsRootPath, $added) {
  const added = []
  // Added FS Elements
  const addedFSElements = $added
  const addedFSElementsLength = addedFSElements.length
  var addedFSElementsIndex = 0
  while(addedFSElementsIndex < addedFSElementsLength) {
    const addedFSElement = addedFSElements[addedFSElementsIndex]
    const addedFSElementDoc = $collection.find(($collectionDoc) => {
      return $collectionDoc.fs.path === addedFSElement.replace(
        $fsRootPath.concat('/'), ''
      )
    })
    if(addedFSElementDoc.fs.operations.add === false) {
      addedFSElementsIndex++
      continue
    }
    const addedFSElementDocPath = path.join(
      $fsRootPath, addedFSElementDoc.fs.path
    )
    switch(addedFSElementDoc.fs.type) {
      case 'File':
        const fileHandle = await open(addedFSElementDocPath, 'w')
        await fileHandle.close()
        break
      case 'Fold':
        await mkdir(addedFSElementDocPath, {
          recursive: true,
        })
        break
    }
    added.push(addedFSElementDoc)
    addedFSElementsIndex++
  }
}