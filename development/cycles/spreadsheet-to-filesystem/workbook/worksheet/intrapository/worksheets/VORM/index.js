import collectToFileCollect from './collectToFileCollect/index.js'
import saveFileCollect from './saveFileCollect/index.js'

async function VORM($collect, $settings) {
  const { worksheet, models } = $settings
  var fileCollect = await collectToFileCollect($collect, worksheet)
  fileCollect = await saveFileCollect(fileCollect, models)
  return fileCollect
}

export default VORM