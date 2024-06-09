import collectToFileCollect from './collectToFileCollect/index.js'
import transformFileCollect from './transformFileCollect/index.js'
import saveFileCollect from './saveFileCollect/index.js'

async function VIEW($collect, $settings) {
	const { worksheet, models } = $settings
	var fileCollect = await collectToFileCollect(
		$collect, worksheet
	)
	fileCollect = transformFileCollect(fileCollect, worksheet)
	fileCollect = await saveFileCollect(fileCollect, worksheet, models)
	return fileCollect
}

export default VIEW
