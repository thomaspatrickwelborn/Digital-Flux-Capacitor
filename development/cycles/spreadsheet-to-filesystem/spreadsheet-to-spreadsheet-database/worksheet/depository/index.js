import { EventEmitter } from 'node:events'
import {
  typeOf, parseCell, tem
} from '#utils/index.js'
import Merges from './merges/index.js'
import Ranges from './ranges/index.js'
import Data from './data/index.js'
import LMNRanges from './lmnRanges/index.js'
import Mods from './mods/index.js'


const { Row, Col, Range, Cell } = tem
export default class Depository extends EventEmitter {
  #settings = {}
  #options = {}
  #_hidden
  #_rows = []
  #_cols = []
  #_data
  #_ranges
  #_lmnRanges
  #_merges
  #_mods
  constructor($settings, $options) {
    super()
    this.#settings = $settings
    this.#options = $options
    this.rows = this.#settings['!rows']
    this.cols = this.#settings['!cols']   
    this.hidden = {
      rows: this.rows,
      cols: this.cols,
    }
    this.#_merges = new Merges({
      merges: this.#settings['!merges'],
      hidden: this.hidden,
    })
    this.#_ranges = new Ranges({
      ranges: this.#settings['!ranges'],
      hidden: this.hidden,
    }, this.#options.ranges)

    this.#_lmnRanges = new LMNRanges(
      this.ranges.getRangesByName(
        new RegExp(/^LMN_/)
      )
    )
    this.#_data = new Data({
      data: this.#settings['!data'],
      ranges: this.ranges,
      hidden: this.hidden,
    })
    this.#_mods = new Mods({
      data: this.data,
      ranges: this.ranges,
      merges: this.merges,
    })
  }
  get data() { return this.#_data }
  get ranges() { return this.#_ranges }
  get lmnRanges() { return this.#_lmnRanges }
  get merges() { return this.#_merges }
  get mods() { return this.#_mods }
  get rows() { return this.#_rows }
  set rows($rows = []) {
    const _rows = this.#_rows
    if(Object.isFrozen(_rows) === false) {
      $rows = structuredClone($rows)
      const rowsLength = $rows.length
      var rowsIndex = 0
      while(rowsIndex < rowsLength) {
        var row = (
          typeOf($rows[rowsIndex]) === 'undefined'
        ) ? new Row()
          : $rows[rowsIndex]
        Object.freeze(row)
        _rows.push(row)
        rowsIndex++
      }
      Object.freeze(_rows)
    }
    return _rows
  }
  get cols() { return this.#_cols }
  set cols($cols = []) {
    const _cols = this.#_cols
    if(Object.isFrozen(_cols) === false) {
      $cols = structuredClone($cols)
      const colsLength = $cols.length
      var colsIndex = 0
      while(colsIndex < colsLength) {
        var col = (
          typeOf($cols[colsIndex]) === 'undefined'
        ) ? new Col()
          : $cols[colsIndex]
        Object.freeze(col)
        _cols.push(col)
        colsIndex++
      }
      Object.freeze(_cols)
    }
    return _cols
  }
  get hidden() { return this.#_hidden }
  set hidden($hidden) {
    if(this.#_hidden === undefined) {
      const _hidden = { rows: [], cols: [] }
      const rows = $hidden.rows.reduce(
        ($rows, $row, $rowIndex) => {
          if($row.hidden) $rows.push($rowIndex)
          return $rows
        }, _hidden.rows
      ).reverse()
      const cols = $hidden.cols.reduce(
        ($cols, $col, $colIndex) => {
          if($col.hidden) $cols.push($colIndex)
          return $cols
        }, _hidden.cols
      ).reverse()
      this.#_hidden = _hidden
    }
  }
}