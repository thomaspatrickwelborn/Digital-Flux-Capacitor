import { EventEmitter } from 'node:events'
import { typeOf, tem } from '#utils/index.js'
const { Row } = tem
export default class Rows extends EventEmitter {
  length = 0
  #settings = []
  #_hidden = []
  get hidden() { return this.#_hidden }
  get raw() { return this.#settings }
  constructor($settings = []) {
    super()
    this.#settings = $settings
    const _rows = this
    const $rows = structuredClone(this.raw)
    const rowsLength = $rows.length
    var rowsIndex = 0
    iterateRows: 
    while(rowsIndex < rowsLength) {
      var row = $rows[rowsIndex] || {}
      if(row.hidden) {
        this.hidden.push(rowsIndex)
      } else {
        Array.prototype.push.call(_rows, row)
      }
      rowsIndex++
    }
  }
}