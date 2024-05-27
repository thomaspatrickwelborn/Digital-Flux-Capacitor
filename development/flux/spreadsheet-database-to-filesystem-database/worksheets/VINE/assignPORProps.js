import { typeOf, isNamedRange } from '#utils/index.js'

const portalPropKeys = ['flow', 'name', 'default']

function assignPORProps($collect, $worksheet) {
	const collectDocsLength = $collect.length
	var collectDocsIndex = 0
	iterateCollectDocs: while(collectDocsIndex < collectDocsLength) {
		const collectDoc = $collect[collectDocsIndex]
		const collectDocPortals = collectDoc.portal
		const collectDocImports = []
		const collectDocExports = []
		const collectDocPortalsLength = collectDocPortals.length
		var collectDocPortalsIndex = 0
		iterateCollectDocPortals: while(collectDocPortalsIndex < collectDocPortalsLength) {
			const collectDocPortal = collectDocPortals[collectDocPortalsIndex]
			if(collectDocPortal.flow === undefined) {
				collectDocPortalsIndex++
				continue iterateCollectDocPortals
			}
			// Collect Doc Import Flow
			if(collectDocPortal.flow === 'I') {
				// Collect Doc Import Preduct Flow
				var preductCollectDocsIndex = collectDocsIndex - 1
				iteratePreductCollectDocs: while(preductCollectDocsIndex >= 0) {
					// Preduct Collect Doc
					const preductCollectDoc = $collect[preductCollectDocsIndex]
					const preductCollectDocPortal = preductCollectDoc.portal[collectDocPortalsIndex]
					if(preductCollectDocPortal.flow === undefined) {
						break iteratePreductCollectDocs
					} else if(
						preductCollectDocPortal.flow === '|'
					) {
						preductCollectDocsIndex--
						continue iteratePreductCollectDocs
					} else if(
						preductCollectDocPortal.flow === 'O'
					) {
						var collectDocImportPath = preductCollectDoc.path
						.replace(new RegExp(`^${preductCollectDoc.workspace}/`), '')
						collectDocImportPath = collectDocImportPath
						.replace(new RegExp(`^node_modules/`), '')
						// Collect Doc Import
						const collectDocImport = {}
						// Import Name
						collectDocImport.name = collectDocPortal.name
						// Import Default
						if(collectDocPortal.default !== undefined) {
							collectDocImport.default = collectDocPortal.default
						}
						// Import Path
						collectDocImport.path = collectDocImportPath
						collectDocImports.push(collectDocImport)
					}
					preductCollectDocsIndex--
				}
				// Collect Doc Import Antduct Flow
				var antductCollectDocsIndex = collectDocsIndex + 1
				iterateAntductCollectDocs: while(antductCollectDocsIndex < $collect.length) {
					// Antduct Collect Doc
					const antductCollectDoc = $collect[antductCollectDocsIndex]
					const antductCollectDocPortal = antductCollectDoc.portal[collectDocPortalsIndex]
					if(antductCollectDocPortal.flow === undefined) {
						break iterateAntductCollectDocs
					} else if(
						antductCollectDocPortal.flow === '|'
					) {
						antductCollectDocsIndex++
						continue iterateAntductCollectDocs
					} else if(
						antductCollectDocPortal.flow === 'O'
					) {
						const collectDocImportPath = antductCollectDoc.path
						.replace(new RegExp(`^${antductCollectDoc.workspace}/`), '')
						// Collect Doc Import
						const collectDocImport = {}
						// Import Name
						collectDocImport.name = collectDocPortal.name
						// Import Default
						if(collectDocPortal.default !== undefined) {
							collectDocImport.default = collectDocPortal.default
						}
						// Import Path
						collectDocImport.path = collectDocImportPath
						collectDocImports.push(collectDocImport)
					}
					antductCollectDocsIndex++
				}
			}
			// Collect Doc Export Flow
			if(collectDocPortal.flow === 'O') {
				// Collect Doc Export
				const collectDocExport = {}
				// Export Name
				collectDocExport.name = collectDocPortal.name
				// Export Default
				if(collectDocPortal.default !== undefined) {
					collectDocExport.default = collectDocPortal.default
				}
				collectDocExports.push(collectDocExport)
			}
			collectDocPortalsIndex++
		}
		collectDoc.import = collectDocImports
		collectDoc.export = collectDocExports
		collectDocsIndex++
	}
	return $collect
}

export default assignPORProps