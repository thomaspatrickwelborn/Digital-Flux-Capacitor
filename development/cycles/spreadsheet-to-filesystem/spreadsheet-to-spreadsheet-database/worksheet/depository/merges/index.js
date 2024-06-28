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
    const merges = this
    iterateMerges: 
    for(const $merge of this.raw) {
      Array.prototype.push.call(this, $merge)
      const hidden = this.#hidden
      const hiddenRows = hidden.rows
      const hiddenRowsLength = hiddenRows.length
      const hiddenCols = hidden.cols
      const hiddenColsLength = hiddenCols.length
      var hiddenRowsIndex = 0
      while(hiddenRowsIndex < hiddenRowsLength) {
        const $hiddenRowIndex = hiddenRows[hiddenRowsIndex]
        if($hiddenRowIndex < $merge.s.r) {
          if($merge.s.r - 1 < 0) {
            if($merge.e.r - 1 < 0) {
              $merge.s.r = -1
              $merge.e.r = -1
            } else {
              $merge.s.r = 0
              $merge.e.r -= 1
            }
          } else {
            $merge.s.r -= 1
            $merge.e.r -= 1
          }
        } else if(
          $hiddenRowIndex >= $merge.s.r &&
          $hiddenRowIndex <= $merge.e.r
        ) {
          if($merge.e.r - 1 < $merge.s.r) {
            $merge.s.r = -1
            $merge.e.r = -1
          } else {
            $merge.e.r -= 1
          }
        }
        hiddenRowsIndex++
      }
      var hiddenColsIndex = 0
      while(hiddenColsIndex < hiddenColsLength) {
        const $hiddenColIndex = hiddenCols[hiddenColsIndex]
        if($hiddenColIndex < $merge.s.c) {
          if($merge.s.c - 1 < 0) {
            if($merge.e.c - 1 < 0) {
              $merge.s.c = -1
              $merge.e.c = -1
            } else {
              $merge.s.c = 0
              $merge.e.c -= 1
            }
          } else {
            $merge.s.c -= 1
            $merge.e.c -= 1
          }
        } else if(
          $hiddenColIndex >= $merge.s.c &&
          $hiddenColIndex <= $merge.e.c
        ) {
          if($merge.e.c - 1 < $merge.s.c) {
            $merge.s.c = -1
            $merge.e.c = -1
          } else {
            $merge.e.c -= 1
          }
        }
        hiddenColsIndex++
      }
      if((
        $merge.s.r > -1 &&
        $merge.e.r > -1
      ) && (
        $merge.s.c > -1 &&
        $merge.e.c > -1
      )) Array.prototype.push.call(merges, $merge)
    }
    return merges
  }
}