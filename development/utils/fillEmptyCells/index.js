import { typeOf } from '#utils/index.js'

export default function fillEmptyCells($matrix) {
	const rowsLength = $matrix.length || 0
	const colsLength = $matrix[0]?.length || 0
	var colsIndex = 0
	while(colsIndex < colsLength) {
		var rowsIndex = 0
		while(rowsIndex < rowsLength) {
			var cell = $matrix[rowsIndex][colsIndex]
			if(
				cell === undefined ||
				cell.length === 0
			) {
				if(
					rowsIndex === 0 &&
					colsIndex > 0
				) {
					cell = $matrix[rowsIndex][colsIndex - 1]
				} else if(
					rowsIndex > 0 &&
					colsIndex > 0
				) {
					if(
						$matrix[rowsIndex - 1][colsIndex] === $matrix[rowsIndex - 1][colsIndex - 1] &&
						(
							$matrix[rowsIndex][colsIndex - 1]?.length > 0 ||
							typeOf($matrix[rowsIndex][colsIndex - 1]) === 'number'
						)
					) {
						cell = $matrix[rowsIndex][colsIndex - 1]
					}
				}
				$matrix[rowsIndex][colsIndex] = cell
			}
			rowsIndex++
		}
		colsIndex++
	}
	return $matrix
}