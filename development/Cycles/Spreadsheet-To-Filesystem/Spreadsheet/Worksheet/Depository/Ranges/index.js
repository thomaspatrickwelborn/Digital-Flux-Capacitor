import { EventEmitter } from 'node:events'
import { typeOf } from '#Coutil/index.js'
import * as XLSX from 'xlsx'

export default class Ranges extends EventEmitter {
  length = 0
  #_settings = []
  get #settings() { return this.#_settings }
  set #settings($settings) { this.#_settings = $settings }
  #_options = []
  get #options() { return this.#_options }
  set #options($options) {
    const _options = this.#_options
    for(const [
      $rangeName, $range
    ] of Object.entries($options)) {
      _options.push(Object.assign({
        Name: $rangeName,
      }, $range))
    }
  }
  get #hidden() { return this.#settings.hidden }
  get raw() {
    return Array.prototype.concat(
      this.#settings.ranges,
      this.#options
    )
  }
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
    let rangesIndex = 0
    const hidden = this.#hidden
    // Iterate Ranges
    iterateRanges: 
    for(let $range of this.raw) {
      if($range.Ref) {
        $range.Ref = this.#parseRangeRef($range.Ref)      
        $range = structuredClone($range)
        const hiddenRows = hidden.rows
        const hiddenRowsLength = hiddenRows.length
        const hiddenCols = hidden.cols
        const hiddenColsLength = hiddenCols.length
        var hiddenRowsIndex = 0
        Object.assign($range, this.#options.find(
          ($option) => $option.Name === $range.Name
        ))
        const { Name, Ref, Class } = $range
        // Iterate Hidden Rows
        iterateHiddenRows: 
        while(hiddenRowsIndex < hiddenRowsLength) {
          const $hiddenRowIndex = hiddenRows[hiddenRowsIndex]
          if(
            $hiddenRowIndex < Ref.s.r
          ) {
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
        // Iterate Hidden Cols
        iterateHiddenCols: 
        while(hiddenColsIndex < hiddenColsLength) {
          const $hiddenColIndex = hiddenCols[hiddenColsIndex]
          if(
            $hiddenColIndex < Ref.s.c
          ) {
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
      } else
      if(
        Array.prototype.findIndex.call(
          this, (
            $prearrange
          ) => $prearrange.Name === $range.Name
        ) === -1
      ) {
        Array.prototype.push.call(this, $range)
      }
      rangesIndex++
    }
  }
  getRawRangesByName($rangeName/*, $raw = false*/) {
    const targetRanges = this.#settings.ranges
    var ranges
    if(typeOf($rangeName) === 'string') {
      ranges = targetRanges.filter(
        ($range) => $range.Name === $rangeName
      )
    } else
    if($rangeName instanceof RegExp) {
      ranges = targetRanges.filter(
        ($modRange) => $modRange.Name.match($rangeName)
      )
    }
    return ranges
  }
  getRangesByName($rangeName/*, $raw = false*/) {
    const targetRanges = Array.from(this)
    var ranges
    if(typeOf($rangeName) === 'string') {
      ranges = targetRanges.filter(
        ($range) => $range.Name === $rangeName
      )
    } else
    if($rangeName instanceof RegExp) {
      ranges = targetRanges.filter(
        ($modRange) => $modRange.Name.match($rangeName)
      )
    }
    return ranges
  }
}