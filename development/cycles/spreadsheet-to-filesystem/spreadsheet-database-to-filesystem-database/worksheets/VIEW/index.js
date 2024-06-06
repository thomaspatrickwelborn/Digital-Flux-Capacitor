import collectToFileCollects from './collectToFileCollects/index.js'
import transformFileCollects from './transformFileCollects/index.js'
import saveFileCollect from './saveFileCollect/index.js'

async function VIEW($collect, $settings) {
	const { worksheet, models, lmnRanges } = $settings
	console.log('worksheet', worksheet)
  throw "Digital Flux Capacitor"
	var fileCollects = await collectToFileCollects(
		$collect, { worksheet, lmnRanges }
	)
	fileCollects = transformFileCollects(fileCollects, worksheet)
	fileCollects = await saveFileCollect(fileCollects, models)
	return fileCollects
}

export default VIEW
