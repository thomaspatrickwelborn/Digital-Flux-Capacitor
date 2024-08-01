import { typeOf, isNamedRange } from '#Coutil/index.js'

function assignProps($prop, $settings) {
  var { supRows, comRow, merges } = $settings
  const supRowsLength = supRows.length
  const supColsLength = supRows[0].length
  var supColsIndex = 0
  while(supColsIndex < supColsLength) {
    var rowCellMerge
    var prop = $prop
    var supRowsIndex = 0
    while(supRowsIndex < supRowsLength) {
      const supRow = supRows[supRowsIndex]
      const isLastSupRow = (supRowsIndex === supRowsLength - 1)
      var propKey = supRows[supRowsIndex][supColsIndex]
      if(propKey === undefined) break
      var anterKey = (!isLastSupRow)
        ? supRows[supRowsIndex + 1][supColsIndex]
        : undefined
      const typeOfAnterKey = typeOf(anterKey)
      rowCellMerge = Array.prototype.find.call(
        merges, ($merge) => ((
          supRowsIndex >= $merge.s.r &&
           supRowsIndex <= $merge.e.r
        ) && (
          supColsIndex >= $merge.s.c &&
          supColsIndex <= $merge.e.c
        ))
      )
      var propVal
      if(typeOfAnterKey === 'number') {
        propVal = prop[propKey] || []
      } else if(typeOfAnterKey === 'string') {
        propVal = prop[propKey] || {}
      } else {
        if(rowCellMerge === undefined) {
          propVal = comRow[supColsIndex]
        } else if(rowCellMerge !== undefined) {
          propVal = comRow
          .slice(rowCellMerge.s.c, rowCellMerge.e.c + 1)
          .find(($comRowCell) => $comRowCell !== undefined)
        }
      }
      if(propVal === undefined) break
      switch(typeof(prop)) {
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
      supRowsIndex++
    }
    supColsIndex++
  }
  return $prop
}

export default assignProps