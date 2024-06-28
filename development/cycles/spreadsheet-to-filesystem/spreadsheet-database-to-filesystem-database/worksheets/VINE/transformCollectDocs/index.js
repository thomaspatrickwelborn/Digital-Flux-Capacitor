import path from 'node:path'

function transformCollectDocPort($ports) {
	const portsLength = $ports?.length
	if(!portsLength) return $ports
	var portsIndex = 0
	iteratePorts:
	while(portsIndex < portsLength) {
		const port = $ports[portsIndex]
		const portNames = []
		const portNamesData = port.name.split('\n')
		const portNamesDataLength = portNamesData.length
		var portNamesDataIndex = 0
		iteratePortNamesData: 
		while(portNamesDataIndex < portNamesDataLength) {
			const portNameData = portNamesData[portNamesDataIndex].split(' ')
			if(portNameData.length === 1) {
				portNames.push({
					name: portNameData[0]
				})
			} else if(
				portNameData.length === 3 &&
				portNameData[1] === 'as'
			) {
				portNames.push({
					name: portNameData[0],
					alias: portNameData[2],
				})
			}
			portNamesDataIndex++
		}
		port.name = portNames
		$ports[portsIndex] = port
		portsIndex++
	}
	return $ports
}

function transormCollectDocs($collect, $worksheet) {
	const collect = []
	const collectLength = $collect.length
	var collectIndex = 0
	iterateCollectDocs: 
	while(collectIndex < collectLength) {
		const collectDoc = $collect[collectIndex]
		if(collectDoc.fs === undefined) {
			collectIndex++
			continue iterateCollectDocs
		}
		const element = {
			fs: {
				id: collectDoc.fs.id,
				workspace: collectDoc.fs.workspace,
				moduleName: collectDoc.fs.moduleName,
				name: collectDoc.fs.name,
				path: collectDoc.fs.path,
				template: collectDoc.fs.template,
				type: collectDoc.fs.type,
				operations: collectDoc.fs.operations,
				encoding: collectDoc.fs.encoding,
				permissions: collectDoc.fs.permission,
			},
			files: collectDoc.files,
			folds: collectDoc.folds,
			imports: transformCollectDocPort(collectDoc.imports),
			exports: transformCollectDocPort(collectDoc.exports),
		}
		collect.push(element)
		collectIndex++
	}
	return collect
}
export default transormCollectDocs