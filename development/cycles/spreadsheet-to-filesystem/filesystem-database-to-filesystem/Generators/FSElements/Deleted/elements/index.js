import path from 'node:path'
import { rm, rmdir, open, opendir, mkdir, stat } from 'node:fs/promises'
export default async function DeletedElements($collection, $deleted) {
  const deleted = []
  const deletedFSElements = $deleted
  const deletedFSElementsLength = deletedFSElements.length
  var deletedFSElementsIndex = 0
  while(deletedFSElementsIndex < deletedFSElementsLength) {
    const deletedFSElement = deletedFSElements[deletedFSElementsIndex]
    const deletedFSElementStat = await stat(deletedFSElement)
    await rm(deletedFSElement, { force: true, recursive: true })
    deleted.push(deletedFSElement)
    deletedFSElementsIndex++
  }
  return deleted
}