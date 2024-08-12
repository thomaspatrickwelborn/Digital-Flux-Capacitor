import { EventEmitter } from 'node:events'
export default class Data extends EventEmitter {
  length = 0
  #settings = {}
  #options = {}
  get #ranges() { return this.#settings.ranges }
  get #hidden() { return this.#settings.hidden }
  get raw() { return this.#settings.data }
  constructor($settings = {}, $options = {}) {
    super()
    this.#settings = $settings
    this.#options = $options
    const $data = this.raw
    const hidden = this.#hidden
    const _data = this
    // const areas = this.#ranges.getRawRangesByName('AREA', true)
    const areas = this.#ranges.getRangesByName('AREA', true)
    if(areas.length === 0) return
    const area = areas[0]
    const rowsLength = area.Ref.e.r + 1
    let rowsIndex = 0
    iterateRows: 
    while(rowsIndex < rowsLength) {
      if(hidden.rows.includes(rowsIndex)) {
        rowsIndex++
        continue iterateRows
      }
      const row = []
      const colsLength = $data[rowsIndex]?.length || 0
      const maxColsLength = area.Ref.e.c
      let colsIndex = 0
      iterateCols: 
      while(colsIndex < colsLength) {
        if(hidden.cols.includes(colsIndex)) {
          colsIndex++
          continue iterateCols
        }
        const cell = $data[rowsIndex][colsIndex]
        row.push(cell?.v)
        colsIndex++
      }
      Array.prototype.push.call(_data, row)
      rowsIndex++
    }
  }
}