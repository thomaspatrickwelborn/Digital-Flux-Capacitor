import { EventEmitter } from 'node:events'
export default class Cols extends EventEmitter {
  length = 0
  #settings = []
  #_hidden = []
  get hidden() { return this.#_hidden }
  get raw() { return this.#settings }
  constructor($settings = {}) {
    super()
    this.#settings = $settings
    const _cols = this
    const $cols = structuredClone(this.raw)
    const colsLength = $cols.length
    var colsIndex = 0
    iterateCols: 
    while(colsIndex < colsLength) {
      var col = $cols[colsIndex] || {}
      if(col.hidden) {
        this.hidden.push(colsIndex)
      } else {
        Array.prototype.push.call(_cols, col)
      }
      colsIndex++
    }
  }
}