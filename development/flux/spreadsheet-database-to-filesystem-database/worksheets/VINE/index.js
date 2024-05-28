import collectDocsToCollectObjects from './collectDocsToCollectObjects.js'
import assignPORProps from './assignPORProps.js'
import assignPATProps from './assignPATProps.js'
import transormCollectDocs from './transormCollectDocs.js'
import saveCollectDocs from './saveCollectDocs.js'

async function VINE($collect, $settings) {
	const { worksheet, models } = $settings
	
	$collect = collectDocsToCollectObjects($collect, worksheet)
	$collect = assignPORProps($collect, worksheet)
	console.log('$collect', $collect)
	// $collect = assignPATProps($collect, worksheet)
	// $collect = transormCollectDocs($collect, worksheet)
	// $collect = await saveCollectDocs($collect, models)
	return $collect
}

export default VINE