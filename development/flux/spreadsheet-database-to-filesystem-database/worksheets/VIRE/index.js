import collectsFromCollect from './collectsFromCollect.js'
import modulePackagesFromCollects from './modulePackagesFromCollects.js'
import saveCollectDocs from './saveCollectDocs.js'
async function VIRE($collect, $settings) {
	const { worksheet, models } = $settings
	const collectEntries = Object.entries(
		collectsFromCollect($collect)
	)
	const modulePackageEntries = Object.values(
		modulePackagesFromCollects(collectEntries)
	)
	const collectDocs = await saveCollectDocs(modulePackageEntries, models)
	return collectDocs
}

export default VIRE
