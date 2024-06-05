import { typeOf } from '#utils/index.js'
import VINE from './VINE/index.js'
import VERS from './VERS/index.js'
import VIEW from './VIEW/index.js'
const WorksheetTranslexes = { VINE, VERS, VIEW }
async function Worksheets($worksheets, $settings) {
	const { presubcycleWorkbook, fluxModels } = $settings
	for(const [
		$worksheetClassName, $worksheet
	] of Array.from(presubcycleWorkbook.worksheets.entries())) {
		const WorksheetTranslexis = WorksheetTranslexes[$worksheetClassName]
		switch(typeOf(WorksheetTranslexis)) {
			case 'asyncfunction':
				await WorksheetTranslexis($worksheet.collect, {
					worksheet: $worksheet,
					models: fluxModels,
				})
				break
			case 'function':
				WorksheetTranslexis($worksheet.collect, {
					worksheet: $worksheet,
					models: fluxModels,
				})
				break
		}
	}
	return $worksheets
}
export default Worksheets
