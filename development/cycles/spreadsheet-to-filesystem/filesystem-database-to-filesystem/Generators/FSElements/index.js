import path from 'node:path'
import { rm, rmdir, open, opendir, mkdir, stat } from 'node:fs/promises'
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob'
import AddedDiff from './Added/diff/index.js'
import UpdatedDiff from './Updated/diff/index.js'
import DeletedDiff from './Deleted/diff/index.js'
import AddedElements from './Added/elements/index.js'
import UpdatedElements from './Updated/elements/index.js'
import DeletedElements from './Added/elements/index.js'

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
			if($collectionDoc.fs.path === undefined) return $fsVine
			$fsVine.push(
				path.join(fsRootPath, $collectionDoc.fs.path)
			)
			return $fsVine
		}, []
	)
  const added = AddedDiff(fsRoot, fsVine)
  const updated = UpdatedDiff(fsRoot, fsVine)
  const deleted = DeletedDiff(fsRoot, fsVine)
	const addedElements = AddedElements($collection, added)
	const updatedElements = UpdatedElements($collection, added)
	const deletedElements = DeletedElements($collection, added)
	return $collection
}

export default FSElements