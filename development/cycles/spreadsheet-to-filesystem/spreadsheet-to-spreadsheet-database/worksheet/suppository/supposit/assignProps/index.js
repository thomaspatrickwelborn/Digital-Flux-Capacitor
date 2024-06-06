import { typeOf, inferType } from '#utils/index.js'
import { Mixed } from 'mongoose'

function assignProps($supposit, $settings) {
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
	iterateColsIndex: 
	while(colsIndex < horizon) {
		var supposit = $supposit
		var rows  = sup
		var rowsIndex = 0
		iterateRowsIndex: 
		while(rowsIndex < verizon) {
			const isLastRow = (rowsIndex === verizon - 1)
			const suppositKey = rows[rowsIndex][colsIndex]
			if(suppositKey === undefined) break iterateRowsIndex
  		var colType = inferType(com, colsIndex)
			var anterKey = (!isLastRow)
				? rows[rowsIndex + 1][colsIndex]
				: undefined
			const typeOfAnterKey = typeOf(anterKey)
			var suppositVal = (
				typeOfAnterKey === 'number'
			) ? []
			  : (
		  	typeOfAnterKey === 'string'
	  	) ? {}
			  : (
		  	colType !== undefined
	  	) ? colType
			  : Mixed
			switchTypeOfSupposit: 
		  switch(typeOf(suppositVal)) {
			  case 'array':
		  	case 'object':
			  	supposit[suppositKey] = supposit[suppositKey] || suppositVal
			  	break switchTypeOfSupposit
		  	default:
		  		if(suppositKey === 'type') {
		  			supposit[suppositKey] = {
		  				type: suppositVal
		  			}
		  		} else {
		  			supposit[suppositKey] = suppositVal
		  		}
		  		break switchTypeOfSupposit
		  }
			const typeOfPropVal = typeOf(supposit[suppositKey])
	    supposit = (
	    	typeOfAnterKey !== 'undefined' && (
					typeOfPropVal === 'object' ||
					typeOfPropVal === 'array'
				)
			) ? supposit[suppositKey]
			  : supposit
	  	rowsIndex++
		}
		colsIndex++
	}
	return $supposit
}

export default assignProps