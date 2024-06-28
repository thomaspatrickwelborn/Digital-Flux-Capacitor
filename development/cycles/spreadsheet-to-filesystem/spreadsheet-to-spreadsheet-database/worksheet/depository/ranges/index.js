import { EventEmitter } from 'node:events'
import { typeOf } from '#utils/index.js'
import * as XLSX from 'xlsx'

export default class Ranges extends EventEmitter {
  length = 0
  #settings = {}
  #options = {}
  #hidden = {}
  get raw() { return this.#settings }
  #parseRangeRef($rangeRef) {
    const rangeRefFrags = $rangeRef.split('!')
    const rangeRefFragsIndex = rangeRefFrags.length - 1
    return XLSX.utils.decode_range(
      rangeRefFrags[rangeRefFragsIndex]
    )
  }
  constructor($settings = {}, $options = {}) {
    super()
    this.#settings = $settings
    this.#options = $options
    this.#hidden = this.#settings.hidden
    let rangesIndex = 0
    for(let $range of $settings) {
      $range.Ref = this.#parseRangeRef($range.Ref)      
      $range = structuredClone($range)
      const hidden = this.#hidden
      const hiddenRows = hidden.rows
      const hiddenRowsLength = hiddenRows.length
      const hiddenCols = hidden.cols
      const hiddenColsLength = hiddenCols.length
      var hiddenRowsIndex = 0
      Object.assign($range, this.#options[$range.Name])
      const { Name, Ref, Class } = $range
      while(hiddenRowsIndex < hiddenRowsLength) {
        const $hiddenRowIndex = hiddenRows[hiddenRowsIndex]
        if($hiddenRowIndex < Ref.s.r) {
          Ref.s.r -= 1
          Ref.e.r -= 1
        } else if(
          $hiddenRowIndex >= Ref.s.r &&
          $hiddenRowIndex <= Ref.e.r
        ) {
          Ref.e.r -= 1
        }
        hiddenRowsIndex++
      }
      var hiddenColsIndex = 0
      while(hiddenColsIndex < hiddenColsLength) {
        const $hiddenColIndex = hiddenCols[hiddenColsIndex]
        if($hiddenColIndex < Ref.s.c) {
          Ref.s.c -= 1
          Ref.e.c -= 1
        } else if(
          $hiddenColIndex >= Ref.s.c &&
          $hiddenColIndex <= Ref.e.c
        ) {
          Ref.e.c -= 1
        }
        hiddenColsIndex++
      }
      if((
        Ref.s.r > -1 &&
        Ref.e.r > -1
      ) && (
        Ref.s.c > -1 &&
        Ref.e.c > -1
      )) {
        Array.prototype.push.call(this, $range)
      }
      rangesIndex++
    }
    Object.freeze(this)
  }
  getRangesByName($rangeName, $raw = false) {
    const targetRanges = ($raw) ? this.#settings : this
    var ranges
    if(typeOf($rangeName) === 'string') {
      ranges = Array.prototype.filter.call(
        targetRanges,
        ($range) => $range.Name === $rangeName
      )
    } else
    if($rangeName instanceof RegExp) {
      ranges = Array.prototype.filter.call(
        targetRanges,
        ($modRange) => {
          return $modRange.Name.match($rangeName)
        }
      )
    }
    return ranges
  }
}