import { typeOf } from '#utils/index.js'
import VERS from './VERS/index.js'
import VIEW from './VIEW/index.js'
import VINE from './VINE/index.js'
import VIRE from './VIRE/index.js'
const worksheets = { VERS, VIEW, VINE, VIRE }
async function Worksheets($worksheets, $settings) {
	const { presubcycleWorkbook, fluxModels } = $settings
	for(const [
		$worksheetClassName, $worksheetClass
	] of Array.from(presubcycleWorkbook.worksheets.entries())) {
		for(const [
			$worksheetClassIndex, $worksheet
		] of Array.from($worksheetClass.entries())) {
			const Worksheet = worksheets[$worksheetClassName]
			var worksheetCollect
			switch(typeOf(Worksheet)) {
				case 'asyncfunction':
					worksheetCollect = await Worksheet($worksheet.collect, {
						worksheet: $worksheet,
						models: fluxModels,
					})
					break
				case 'function':
					worksheetCollect = Worksheet($worksheet.collect, {
						worksheet: $worksheet,
						models: fluxModels,
					})
					break
			}
			if($worksheets.has($worksheetClassName)) {
				$worksheets
				.get($worksheetClassName)
				.set($worksheetClassIndex, worksheetCollect)
			} else {
				$worksheets
				.set($worksheetClassName, new Map([
					[$worksheetClassIndex, worksheetCollect]
				]))
			}
		}
	}
	return $worksheets
}
export default Worksheets
