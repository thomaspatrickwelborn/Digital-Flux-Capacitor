import collectDocsToCollectObjects from './collectDocsToCollectObjects/index.js'
import assignPORProps from './assignPORProps/index.js'
import transormCollectDocs from './transformCollectDocs/index.js'
import saveCollectDocs from './saveCollectDocs/index.js'

async function VINE($collects, $settings) {
	const { worksheet, models } = $settings
	var collect = [...$collects.values()]
	.map(($collect) => {
		return Array.from($collect)
	}).flat()
	collect = collectDocsToCollectObjects(collect, worksheet)
	collect = assignPORProps(collect, worksheet)
	collect = transormCollectDocs(collect, worksheet)
	collect = await saveCollectDocs(collect, models)
	return collect
}

export default VINE