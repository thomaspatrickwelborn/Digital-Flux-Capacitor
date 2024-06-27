import { EventEmitter } from 'node:events'
import { typeOf } from '#utils/index.js'
import * as XLSX from 'xlsx'

export default class Ranges extends EventEmitter {
  length = 0
  #settings = {}
  #options = {}
  #hidden = {}
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
    for(const $range of $settings) {
      const hidden = this.#hidden
      const hiddenRows = hidden.rows
      const hiddenRowsLength = hiddenRows.length
      const hiddenCols = hidden.cols
      const hiddenColsLength = hiddenCols.length
      var hiddenRowsIndex = 0
      $range.Ref = this.#parseRangeRef($range.Ref)      
      const { Name, Ref } = $range
      while(hiddenRowsIndex < hiddenRowsLength) {
        const $hiddenRowIndex = hiddenRows[hiddenRowsIndex]
        if($hiddenRowIndex < Ref.s.r) {
          if(Ref.s.r - 1 < 0) {
            if(Ref.e.r - 1 < 0) {
              Ref.s.r = -1
              Ref.e.r = -1
            } else {
              Ref.s.r = 0
              Ref.e.r -= 1
            }
          } else {
            Ref.s.r -= 1
            Ref.e.r -= 1
          }
        } else if(
          $hiddenRowIndex >= Ref.s.r &&
          $hiddenRowIndex <= Ref.e.r
        ) {
          if(Ref.e.r - 1 < Ref.s.r) {
            Ref.s.r = -1
            Ref.e.r = -1
          } else {
            Ref.e.r -= 1
          }
        }
        hiddenRowsIndex++
      }
      var hiddenColsIndex = 0
      while(hiddenColsIndex < hiddenColsLength) {
        const $hiddenColIndex = hiddenCols[hiddenColsIndex]
        if($hiddenColIndex < Ref.s.c) {
          if(Ref.s.c - 1 < 0) {
            if(Ref.e.c - 1 < 0) {
              Ref.s.c = -1
              Ref.e.c = -1
            } else {
              Ref.s.c = 0
              Ref.e.c -= 1
            }
          } else {
            Ref.s.c -= 1
            Ref.e.c -= 1
          }
        } else if(
          $hiddenColIndex >= Ref.s.c &&
          $hiddenColIndex <= Ref.e.c
        ) {
          if(Ref.e.c - 1 < Ref.s.c) {
            Ref.s.c = -1
            Ref.e.c = -1
          } else {
            Ref.e.c -= 1
          }
        }
        hiddenColsIndex++
      }
      if((
        Ref.s.r !== -1 &&
        Ref.e.r !== -1
      ) && (
        Ref.s.c !== -1 &&
        Ref.e.c !== -1
      )) Array.prototype.push.call(this, $range)
      rangesIndex++
    }
    Object.freeze(this)
    console.log(this)
  }
  getRangesByName($rangeName, $rangesOptions) {
    var ranges
    if(typeOf($rangeName) === 'string') {
      ranges = Array.prototype.filter.call(
        this,
        ($range) => $range.Name === $rangeName
      )
    } else
    if($rangeName instanceof RegExp) {
      ranges = Array.prototype.filter.call(
        this,
        ($modRange) => {
          return $modRange.Name.match($rangeName)
        }
      )
    }
    return ranges
  }
}