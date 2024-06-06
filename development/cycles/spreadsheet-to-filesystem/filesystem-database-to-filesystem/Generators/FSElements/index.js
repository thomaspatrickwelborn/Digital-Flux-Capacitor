import path from 'node:path'
import { rm, rmdir, open, opendir, mkdir, stat } from 'node:fs/promises'
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob'
import differentiateFSElements from './differentiateFSElements/index.js'

async function FSElements($collection, $presubcycle, $subcycle) {
	const fsRootPath = $subcycle.filesystem.path
	var fsRootStat
	try {
		fsRootStat = await stat(fsRootPath)
	} catch($err) {
		await mkdir(fsRootPath, {
			recursive: true,
		})
	}
	const fsRoot = await globSync(
		path.join(fsRootPath, '**/*'),
		{ dot: true },
	)
	const fsVine = $collection.reduce(
		($fsVine, $collectionDoc) => {
			console.log($collectionDoc)
			throw "Digital Flux Capacitor"
			$fsVine.push(
				path.join(fsRootPath, $collectionDoc.fs.path)
			)
			return $fsVine
		}, []
	)
	const { added, updated, deleted } = differentiateFSElements(fsRoot, fsVine)
	// Added FS Elements
	const addedFSElements = added
	const addedFSElementsLength = addedFSElements.length
	var addedFSElementsIndex = 0
	while(addedFSElementsIndex < addedFSElementsLength) {
		const addedFSElement = addedFSElements[addedFSElementsIndex]
		const addedFSElementDoc = $collection.find(($collectionDoc) => {
			return $collectionDoc.fs.path === addedFSElement.replace(fsRootPath.concat('/'), '')
		})
		if(addedFSElementDoc.fs.operations.add === false) {
			addedFSElementsIndex++
			continue
		}
		const addedFSElementDocPath = path.join(fsRootPath, addedFSElementDoc.fs.path)
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
		addedFSElementsIndex++
	}
	// Deleted FS Elements
	const deletedFSElements = deleted
	const deletedFSElementsLength = deletedFSElements.length
	var deletedFSElementsIndex = 0
	while(deletedFSElementsIndex < deletedFSElementsLength) {
		const deletedFSElement = deletedFSElements[deletedFSElementsIndex]
		const deletedFSElementStat = await stat(deletedFSElement)
		await rm(deletedFSElement, { force: true, recursive: true })
		deletedFSElementsIndex++
	}
	return $collection
}

export default FSElements