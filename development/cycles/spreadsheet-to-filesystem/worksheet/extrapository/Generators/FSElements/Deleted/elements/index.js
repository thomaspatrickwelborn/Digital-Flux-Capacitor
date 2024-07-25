import path from 'node:path'
import { rm, rmdir, open, opendir, mkdir, stat } from 'node:fs/promises'
export default async function DeletedElements($collection, $fsRootPath, $deleted) {
  const collectionLength = $collection.length
  const deleted = []
  const deletedFSElements = $deleted
  const deletedFSElementsLength = deletedFSElements.length
  let deletedFSElementsIndex = deletedFSElementsLength - 1
  iterateDeletedFSElements: 
  while(deletedFSElementsIndex > -1) {
    const deletedFSElement = deletedFSElements[deletedFSElementsIndex]
    .replace($fsRootPath.concat('/'), '')
    let collectionIndex = 0
    iterateCollectionDocs: 
    while(collectionIndex < collectionLength) {
      const collectionDoc = $collection[collectionIndex]
      const collectionDocPath = collectionDoc?.fs?.path
      const deletedFSElementMatch = deletedFSElement.match(
        new RegExp(`^${collectionDocPath}`)
      )
      if(
        deletedFSElementMatch &&
        collectionDoc.fs.operations.delete
      ) {
        const deletedFSElementDocPath = path.join(
          $fsRootPath, deletedFSElement
        )
        const deletedFSElementStat = await stat(deletedFSElementDocPath)
        if(
          deletedFSElementStat?.isFile() === true ||
          deletedFSElementStat?.isFile() === false
        ) {
          rm(deletedFSElementDocPath, {
            force: false, recursive: true
          })
          deleted.push(deletedFSElement)
          break iterateCollectionDocs
        }
      }
      collectionIndex++
    }
    deletedFSElementsIndex--
  }
  return deleted
}