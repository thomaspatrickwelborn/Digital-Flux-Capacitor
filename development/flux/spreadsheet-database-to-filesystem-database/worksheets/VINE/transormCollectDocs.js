import path from 'node:path'

function transformCollectDocPort($ports) {
	const portsLength = $ports.length
	if(portsLength === 0) return $ports
	var portsIndex = 0
	iteratePorts: while(portsIndex < portsLength) {
		const port = $ports[portsIndex]
		const portNames = []
		const portNamesData = port.name.split('\n')
		const portNamesDataLength = portNamesData.length
		var portNamesDataIndex = 0
		iteratePortNamesData: while(portNamesDataIndex < portNamesDataLength) {
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
	while(collectIndex < collectLength) {
		const collectDoc = $collect[collectIndex]
		const fsSettingsPropKeys = [
			'id', 'name', 'workspaces', 'path', 'permissions', 
			'operations', 'template', 'encoding', 'subset'
		]
		const fsDataPropKeys = [
			'import', 'export'
		]
		const fsSettings = {}
		const fsData = {}
		const fsElement = {}
		for(var [
			$collectDocPropKey, $collectDocPropVal
		] of Object.entries(collectDoc)) {
			// FS Element Settings
			if(
				fsSettingsPropKeys.includes($collectDocPropKey)
			) {
				switch($collectDocPropKey) {
					case 'subset':
						fsSettings['type'] = $collectDocPropVal
						break
					default:
						fsSettings[$collectDocPropKey] = $collectDocPropVal
						break
				}
			}
			// FS Element Data
			if(
				fsDataPropKeys.includes($collectDocPropKey)
			) {
				switch($collectDocPropKey) {
					case 'import':
					case 'export':
						fsData[$collectDocPropKey] = transformCollectDocPort($collectDocPropVal)
					default:
						fsData[$collectDocPropKey] = $collectDocPropVal
						break
				}
			}
		}
		switch(collectDoc.subset) {
			case 'File':
				fsElement.fs = fsSettings
				fsElement.data = fsData
				break
			case 'Fold':
				fsElement.fs = fsSettings
				break
		}
		collect.push(fsElement)
		collectIndex++
	}
	return collect
}
export default transormCollectDocs