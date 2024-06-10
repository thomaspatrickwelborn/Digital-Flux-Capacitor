import path from 'node:path'
import { typeOf, isNamedRange } from '#utils/index.js'
const portalPropKeys = ['flow', 'name', 'default']
function assignPORProps($collect, $worksheet) {
	const collectDocsLength = $collect.length
	var collectDocsIndex = 0
	iterateCollectDocs: 
	while(collectDocsIndex < collectDocsLength) {
		const collectDoc = $collect[collectDocsIndex]
		const collectDocPortals = collectDoc.portal
		const collectDocImports = []
		const collectDocExports = []
		const collectDocPortalsLength = collectDocPortals.length
		var collectDocPortalsIndex = 0
		iterateCollectDocPortals: 
		while(collectDocPortalsIndex < collectDocPortalsLength) {
			const collectDocPortal = collectDocPortals[collectDocPortalsIndex]
			if(collectDocPortal.flow === undefined) {
				collectDocPortalsIndex++
				continue iterateCollectDocPortals
			}
			// Collect Doc Import Flow
			if(collectDocPortal.flow === 'I') {
				// Collect Doc Import Preterduct Flow
				var preterductCollectDocsIndex = collectDocsIndex - 1
				iteratePreterductCollectDocs:
				while(preterductCollectDocsIndex >= 0) {
					// Preterduct Collect Doc
					const preterductCollectDoc = $collect[preterductCollectDocsIndex]
					const preterductCollectDocPortal = preterductCollectDoc.portal[collectDocPortalsIndex]
					if(preterductCollectDocPortal.flow === undefined) {
						break iteratePreterductCollectDocs
					} else if(
						preterductCollectDocPortal.flow === '|'
					) {
						preterductCollectDocsIndex--
						continue iteratePreterductCollectDocs
					} else if(
						preterductCollectDocPortal.flow === 'O'
					) {
						var collectDocImportPath = preterductCollectDoc.fs.path
						.replace(new RegExp(`^${preterductCollectDoc.fs.workspace}/`), '')
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
						if(collectDocPortal.lat === 're') {
							collectDocImport.path = path.relative(collectDoc.fs.path, preterductCollectDoc.fs.path)
						} else {
							collectDocImport.path = collectDocImportPath
						}
						collectDocImports.push(collectDocImport)
					}
					preterductCollectDocsIndex--
				}
				// Collect Doc Import Anterduct Flow
				var anterductCollectDocsIndex = collectDocsIndex + 1
				iterateAnterductCollectDocs: while(anterductCollectDocsIndex < $collect.length) {
					// Anterduct Collect Doc
					const anterductCollectDoc = $collect[anterductCollectDocsIndex]
					const anterductCollectDocPortal = anterductCollectDoc.portal[collectDocPortalsIndex]
					if(anterductCollectDocPortal.flow === undefined) {
						break iterateAnterductCollectDocs
					} else if(
						anterductCollectDocPortal.flow === '|'
					) {
						anterductCollectDocsIndex++
						continue iterateAnterductCollectDocs
					} else if(
						anterductCollectDocPortal.flow === 'O'
					) {
						const collectDocImportPath = anterductCollectDoc.fs.path
						// Collect Doc Import
						const collectDocImport = {}
						// Import Name
						collectDocImport.name = collectDocPortal.name
						// Import Default
						if(collectDocPortal.default !== undefined) {
							collectDocImport.default = collectDocPortal.default
						}
						// Import Path
						if(collectDocPortal.lat === 're') {
							collectDocImport.path = path.relative(collectDoc.fs.path, anterductCollectDoc.fs.path)
						} else {
							collectDocImport.path = collectDocImportPath
						}
						collectDocImports.push(collectDocImport)
					}
					anterductCollectDocsIndex++
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
		collectDoc.imports = collectDocImports
		collectDoc.exports = collectDocExports
		collectDocsIndex++
	}
	return $collect
}

export default assignPORProps