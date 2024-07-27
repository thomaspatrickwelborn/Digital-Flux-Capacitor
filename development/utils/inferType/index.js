import parseCell from '../parseCell/index.js'
import { typeOf } from '#utils/index.js'
const vals = {
  'string': String,
  'number': Number,
  'boolean': Boolean,
}

export default function inferType($matrix, $colStart, $colStop) {
  $colStop = (
    $colStop === undefined
  ) ? $colStart
    : $colStop 
  var inferType
  const colCellTypes = {}
  const rowsLength = $matrix.length
  var rowsIndex = 0
  while(rowsIndex < rowsLength) {
    const row = $matrix[rowsIndex]
    var cell, cellType
    var colsIndex = $colStart
    while(colsIndex <= $colStop) {
      cell = parseCell(row[colsIndex])
      cellType = typeOf(cell)
      if(cellType !== 'undefined') {
        colCellTypes[cellType] = colCellTypes[cellType] || 0
        colCellTypes[cellType] += 1
      }
      colsIndex++
    }
    rowsIndex++
  }
  const colCellTypesKeys = Object.keys(colCellTypes)
  inferType = (
    colCellTypesKeys.length === 1
  ) ? vals[
    colCellTypesKeys[0]
  ] : (
    colCellTypesKeys.length > 1
  ) ? Object
    : undefined
  return inferType
}