import path from 'node:path'
import { rm, rmdir, open, opendir, mkdir, stat } from 'node:fs/promises'
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob'
import Added from './Added/index.js'
import Updated from './Updated/index.js'
import Deleted from './Deleted/index.js'

export default async function FSElements(
	$collection, $presubcycle, $subcycle
) {
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
  const added = await Added($collection, fsRoot, fsVine)
  const updated = await Updated($collection, fsRoot, fsVine)
  const deleted = await Deleted($collection, fsRoot, fsVine)
	return $collection
}
