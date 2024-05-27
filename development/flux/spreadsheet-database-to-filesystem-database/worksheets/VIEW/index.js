import collectToFileCollects from './collectToFileCollects.js'
import transformFileCollects from './transformFileCollects.js'
import saveFileCollect from './saveFileCollect.js'

async function VIEW($collect, $settings) {
	const { worksheet, models, lmnRanges } = $settings
	var fileCollects = await collectToFileCollects($collect, { worksheet, lmnRanges })
	fileCollects = transformFileCollects(fileCollects, worksheet)
	fileCollects = await saveFileCollect(fileCollects, models)
	return fileCollects
}

export default VIEW
