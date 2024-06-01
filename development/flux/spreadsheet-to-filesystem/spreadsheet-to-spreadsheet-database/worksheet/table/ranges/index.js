import { typeOf } from '#utils/index.js'
import * as XLSX from 'xlsx'
const Defaults = {
  GetRangesOptions: { includeHidden: true },
}

export default class Ranges extends EventTarget {
  length = 0
  #settings = {}
  #options = {}
  #hidden = {}
  constructor($settings = {}, $options = {}) {
    super()
    this.#settings = $settings
    this.#options = $options
    this.#hidden = this.#options.hidden
    const _ranges = this
    if(Object.isFrozen(_ranges) === false) {
      const rangesLength = this.#settings.length
      var rangesIndex = 0
      while(rangesIndex < rangesLength) {
        const range = this.#settings[rangesIndex]
        const rangeRefFrags = range.Ref.split('!')
        const rangeRefFragsIndex = rangeRefFrags.length - 1
        const rangeRef = XLSX.utils.decode_range(
          rangeRefFrags[rangeRefFragsIndex]
        )
        range.Ref = rangeRef
        Object.freeze(range)
        Array.prototype.push.call(_ranges, range)
        rangesIndex++
      }
      Object.freeze(_ranges)
    }
  }
  
  #filterRanges($options = {}) {
    $options = Object.assign(
      {}, Defaults.GetRangesOptions, $options
    )
    const { includeHidden } = $options
    const _ranges = this
    const ranges = []
    const rangesLength = _ranges.length
    var rangesIndex = 0
    while(rangesIndex < rangesLength) {
      const range = _ranges[rangesIndex]
      const { Name, Ref } = range
      if(includeHidden === false) {
        const hidden = this.#hidden
        const hiddenRows = hidden.rows
        const hiddenRowsLength = hiddenRows.length
        const hiddenCols = hidden.cols
        const hiddenColsLength = hiddenCols.length
        var hiddenRowsIndex = 0
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
        )) ranges.push(range)
      } else {
        ranges.push(range)
      }
      rangesIndex++
    }
    return ranges
  }
  getRangesByName($rangeName, $rangesOptions) {
    var ranges
    if(typeOf($rangeName) === 'string') {
      ranges = this.#filterRanges($rangesOptions).filter(
        ($range) => $range.Name === $rangeName
      )
    } else if($rangeName instanceof RegExp) {
      ranges = this.#filterRanges($rangesOptions).filter(
        ($modRange) => $modRange.Name.match($rangeName)
      )
    }
    return ranges
  }
}