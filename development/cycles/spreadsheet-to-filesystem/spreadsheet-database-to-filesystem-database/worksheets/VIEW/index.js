import collectToFileCollects from './collectToFileCollects/index.js'
import transformFileCollects from './transformFileCollects/index.js'
import saveFileCollect from './saveFileCollect/index.js'

async function VIEW($collect, $settings) {
	const { worksheet, models } = $settings
	var fileCollects = await collectToFileCollects(
		$collect, { worksheet }
	)
	fileCollects = transformFileCollects(fileCollects, worksheet)
	fileCollects = await saveFileCollect(fileCollects, models)
	return fileCollects
}

export default VIEW
