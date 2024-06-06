import collectToFileCollects from './collectToFileCollects.js'
import saveFileCollect from './saveFileCollect.js'

async function VERS($collect, $settings) {
	const { worksheet, models } = $settings
	var fileCollects = await collectToFileCollects($collect, worksheet)
	fileCollects = await saveFileCollect(fileCollects, models)
	return fileCollects
}

export default VERS