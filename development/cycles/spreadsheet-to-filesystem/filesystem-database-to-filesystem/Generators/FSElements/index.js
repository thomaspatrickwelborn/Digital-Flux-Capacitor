import EventEmitter from 'node:events'
import path from 'node:path'
import { mkdir, stat } from 'node:fs'
import { globSync } from 'glob'
import Added from './Added/index.js'
import Updated from './Updated/index.js'
import Deleted from './Deleted/index.js'

export default class FSElements extends EventEmitter {
	added
	updated
	deleted
 	constructor(
		$collection, $presubcycle, $subcycle
	) {
 		super()
		const fsRootPath = $subcycle.settings.output.filesystem.path
		var fsRootStat = stat(fsRootPath, ($err, $fsRootStat) => {
			if($err) {
				mkdir(fsRootPath, {
					recursive: true,
				}, ($err) => {
					if($err) return $err
				})
			}
		})
		const fsRoot = globSync(
			path.join(fsRootPath, '**/*'),
			{
				dot: true,
				ignore: [
					path.join(fsRootPath, 'node_modules/**'),
					path.join(fsRootPath, '.git/**')
				]
			}
		)
		console.log(fsRoot)
		const fsVine = $collection.reduce(
			($fsVine, $collectionDoc) => {
				if($collectionDoc.fs.path === undefined) return $fsVine
				$fsVine.push(
					path.join(fsRootPath, $collectionDoc.fs.path)
				)
				return $fsVine
			}, []
		)
		console.log(fsVine)
	  const added = new Added(
	  	$collection, fsRootPath, fsRoot, fsVine
  	)
  	console.log('added', added)
	  // const updated = await Updated(
	  // 	$collection, fsRootPath, fsRoot, fsVine
  	// )
	  // const deleted = await Deleted(
	  // 	$collection, fsRootPath, fsRoot, fsVine
  	// )
		return $collection
	}
}
