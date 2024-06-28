import { EventEmitter } from 'node:events'
export default class Merges extends EventEmitter {
  length = 0
  #settings = {}
  #options = {}
  get #hidden() { return this.#settings.hidden }
  get raw() { return this.#settings.merges }
  constructor($settings = {}, $options = {}) {
    super()
    this.#settings = $settings
    this.#options = $options
    let mergesIndex = 0
    const hidden = this.#hidden
    hidden.rows.reverse()
    hidden.cols.reverse()
    // Iterate Merges
    iterateMerges: 
    for(let $merge of this.raw) {
      $merge = structuredClone($merge)
      const hiddenRows = hidden.rows
      const hiddenRowsLength = hiddenRows.length
      const hiddenCols = hidden.cols
      const hiddenColsLength = hiddenCols.length
      var hiddenRowsIndex = 0
      // Iterate Hidden Rows
      iterateHiddenRows: 
      while(hiddenRowsIndex < hiddenRowsLength) {
        const $hiddenRowIndex = hiddenRows[hiddenRowsIndex]
        if(
          $hiddenRowIndex < $merge.s.r
        ) {
          $merge.s.r -= 1
          $merge.e.r -= 1
        } else if(
          $hiddenRowIndex >= $merge.s.r &&
          $hiddenRowIndex <= $merge.e.r
        ) {
          $merge.e.r -= 1
        }
        hiddenRowsIndex++
      }
      var hiddenColsIndex = 0
      // Iterate Hidden Cols
      iterateHiddenCols: 
      while(hiddenColsIndex < hiddenColsLength) {
        const $hiddenColIndex = hiddenCols[hiddenColsIndex]
        if(
          $hiddenColIndex < $merge.s.c
        ) {
          $merge.s.c -= 1
          $merge.e.c -= 1
        } else if(
          $hiddenColIndex >= $merge.s.c &&
          $hiddenColIndex <= $merge.e.c
        ) {
          $merge.e.c -= 1
        }
        hiddenColsIndex++
      }
      if((
        $merge.s.r > -1 &&
        $merge.e.r > -1
      ) && (
        $merge.s.c > -1 &&
        $merge.e.c > -1
      )) {
        Array.prototype.push.call(this, $merge)
      }
      mergesIndex++
    }
  }
}