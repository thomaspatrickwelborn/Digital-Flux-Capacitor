import { typeOf } from '#utils/index.js'
async function Worksheets($worksheets, $settings) {
	const { prefluxWorkbook, fluxModels } = $settings
	for(const [
		$worksheetClassName, $worksheetClass
	] of Array.from(prefluxWorkbook.worksheets.entries())) {
		for(const [
			$worksheetClassIndex, $worksheet
		] of Array.from($worksheetClass.entries())) {
			const Worksheet = await import(
				`./${$worksheetClassName}/index.js`
			).then($module => $module.default)
			const lmnRanges = $worksheet.getLMNRanges(
				$worksheet.getRanges({ includeHidden: false })
			)
			var worksheetCollect
			switch(typeOf(Worksheet)) {
				case 'asyncfunction':
					worksheetCollect = await Worksheet($worksheet.collect, {
						worksheet: $worksheet,
						models: fluxModels,
						lmnRanges: lmnRanges
					})
					break
				case 'function':
					worksheetCollect = Worksheet($worksheet.collect, {
						worksheet: $worksheet,
						models: fluxModels,
						lmnRanges: lmnRanges,
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
