import path from 'node:path'
import { rm, rmdir, open, opendir, mkdir, stat } from 'node:fs/promises'
export default async function DeletedElements($collection, $fsRootPath, $deleted) {
  console.log('$deleted', $deleted)
  const deleted = []
  const deletedFSElements = $deleted
  const deletedFSElementsLength = deletedFSElements.length
  var deletedFSElementsIndex = 0
  while(deletedFSElementsIndex < deletedFSElementsLength) {
    const deletedFSElement = deletedFSElements[deletedFSElementsIndex]
    .replace($fsRootPath.concat('/'), '')
    // console.log('deletedFSElementDoc', deletedFSElementDoc)
    // if(deletedFSElementDoc.fs.operations.delete === false) {
    //   deletedFSElementsIndex++
    //   continue
    // }
    // const deletedFSElementDocPath = path.join(
    //   $fsRootPath, deletedFSElementDoc.fs.path
    // )
    // const deletedFSElementStat = await stat(deletedFSElement)
    // if(deletedFSElementStat?.isFile() === true) {
    //   rm(deletedFSElement, {
    //     force: false, recursive: true
    //   })
    //   deleted.push(deletedFSElement)
    // } else 
    // if(deletedFSElementStat?.isFile() === false) {
    //   rmdir(deletedFSElement, {
    //     force: false, recursive: true
    //   })
    //   deleted.push(deletedFSElement)
    // }
    deletedFSElementsIndex++
  }
  return deleted
}