function modulePackagesFromCollects($collect) {
	const modulePackages = {}
	const collectEntriesLength = $collect.length
	var collectEntriesIndex = 0
	while(collectEntriesIndex < collectEntriesLength) {
		const [$collectName, $collectDocs] = $collect[collectEntriesIndex]
		const modulePackage = modulePackages[$collectName] || {
			fs: {},
			data: {
				block: {}
			}
		}
		const modulePackageData = modulePackage.data.block
		const collectDocsLength = $collectDocs.length 
		var collectDocsIndex = 0
		while(collectDocsIndex < collectDocsLength) {
			const collectDoc = $collectDocs[collectDocsIndex]
			const collectDocEntries = Object.entries(collectDoc)
			const collectDocEntriesLength = collectDocEntries.length
			var collectDocEntriesIndex = 0
			while(collectDocEntriesIndex < collectDocEntriesLength) {
				const [$collectDocEntryName, $collectDocEntry] = collectDocEntries[collectDocEntriesIndex]
				switch($collectDocEntryName) {
					case 'fs':
						modulePackage['fs'] = $collectDocEntry
						break
					case 'details':
						modulePackageData[$collectDocEntryName] = modulePackageData[$collectDocEntryName] || {}
						modulePackageData[$collectDocEntryName][$collectDocEntry.name] = $collectDocEntry.descript
						break
					case 'dependencies':
						modulePackageData[$collectDocEntryName] = modulePackageData[$collectDocEntryName] || {}
						modulePackageData[$collectDocEntryName][$collectDocEntry.name] = $collectDocEntry.version
						break
					case 'scripts':
						modulePackageData[$collectDocEntryName] = modulePackageData[$collectDocEntryName] || {}
						modulePackageData[$collectDocEntryName][$collectDocEntry.name] = $collectDocEntry.command
						break
					case 'imports':
						modulePackageData[$collectDocEntryName] = modulePackageData[$collectDocEntryName] || {}
						modulePackageData[$collectDocEntryName][$collectDocEntry.name] = $collectDocEntry.path
						break
					case 'workspaces':
						modulePackageData[$collectDocEntryName] = modulePackageData[$collectDocEntryName] || []
						modulePackageData[$collectDocEntryName].push($collectDocEntry)
						break
				}
				collectDocEntriesIndex++
			}
			collectDocsIndex++
		}
		modulePackages[$collectName] = modulePackage
		collectEntriesIndex++
	}
	return modulePackages
}

export default modulePackagesFromCollects