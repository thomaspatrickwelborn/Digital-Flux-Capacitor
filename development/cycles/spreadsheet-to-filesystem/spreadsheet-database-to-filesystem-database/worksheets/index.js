import { typeOf } from '#utils/index.js'
import VINE from './VINE/index.js'
import VERS from './VERS/index.js'
import VIEW from './VIEW/index.js'
const WorksheetTranslexes = { VINE, VERS, VIEW }
export default async function Worksheets($worksheets) {
	const worksheets = []
	const { presubcycleWorkbook, subcycleModels } = $worksheets
	for(const [
		$worksheetClassName, $worksheet
	] of Array.from(presubcycleWorkbook.worksheets.entries())) {
		const WorksheetTranslexis = WorksheetTranslexes[
			$worksheetClassName
		]
		var worksheet
		switch(typeOf(WorksheetTranslexis)) {
			case 'asyncfunction':
				worksheet = await WorksheetTranslexis(
					$worksheet.compository.collects, {
						worksheet: $worksheet,
						models: subcycleModels,
					}
				)
				break
			case 'function':
				worksheet = WorksheetTranslexis(
					$worksheet.compository.collects, {
						worksheet: $worksheet,
						models: subcycleModels,
					}
				)
				break
		}
		worksheets.push([$worksheetClassName, worksheet])
	}
	return worksheets
}
