import collectToFileCollect from './collectToFileCollect.js'
import saveFileCollect from './saveFileCollect.js'

async function VERS($collect, $settings) {
  const { worksheet, models } = $settings
  var fileCollect = await collectToFileCollect($collect, worksheet)
  fileCollect = await saveFileCollect(fileCollect, models)
  return fileCollect
}

export default VERS