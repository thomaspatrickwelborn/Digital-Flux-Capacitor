import {
	typeOf,
	fillEmptyCells,
	inferType,
	combineMerge,
	isNamedRange,
} from '#utils/index.js'
import { Mixed } from 'mongoose'

function assignProps($prop, $settings) {
	console.log('assignProps')
	var { sup, com } = $settings
	const verizon = sup.length
	var horizon = sup.reduce(
		($rows, $row) => {
			return (
				$row.length > $rows
			) ? $row.length
			  : $rows
		}, 0
	)
	var colsIndex = 0
	while(colsIndex < horizon) {
		var prop = $prop
		var rows  = sup
		var rowsIndex = 0
		while(rowsIndex < verizon) {
			const isLastRow = (rowsIndex === verizon - 1)
			const propKey = rows[rowsIndex][colsIndex]
			if(propKey === undefined) break
  		var colType = inferType(com, colsIndex)
			var anterKey = (!isLastRow)
				? rows[rowsIndex + 1][colsIndex]
				: undefined
			const typeOfAnterKey = typeOf(anterKey)
			var propVal = (
				typeOfAnterKey === 'number'
			) ? []
			  : (
		  	typeOfAnterKey === 'string'
	  	) ? {}
			  : colType
		  if(propVal === undefined) {
		  	propVal = Mixed
		  }
		  switch(typeOf(prop)) {
			  case 'array':
		  	case 'object':
			  	prop[propKey] = prop[propKey] || propVal
			  	break
		  	default:
		  		prop[propKey] = propVal
		  		break
		  }
			const typeOfPropVal = typeOf(prop[propKey])
	    prop = (
	    	typeOfAnterKey !== 'undefined' && (
					typeOfPropVal === 'object' ||
					typeOfPropVal === 'array'
				)
			) ? prop[propKey]
			  : prop
	  	rowsIndex++
		}
		colsIndex++
	}
	return $prop
}

export default assignProps