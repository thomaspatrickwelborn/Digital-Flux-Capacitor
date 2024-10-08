import { EventEmitter } from 'node:events'
import Cols from './Cols/index.js'
import Rows from './Rows/index.js'
import Hidden from './Hidden/index.js'
import Merges from './Merges/index.js'
import Ranges from './Ranges/index.js'
import Data from './Data/index.js'
import LMNRanges from './LMNRanges/index.js'
import Mods from './Mods/index.js'

export default class Depository extends EventEmitter {
  #tableClone
  #table
  #options
  #_rows
  #_cols
  #_hidden
  #_merges
  #_ranges
  #_lmnRanges
  #_data
  #_mods
  constructor($table, $options) {
    super()
    this.#tableClone = structuredClone($table)
    this.#table = $table
    this.#options = $options
    this.rows
    this.cols
    this.hidden
    this.merges
    this.ranges
    this.lmnRanges
    this.data
    this.mods
  }
  get rows() {
    if(this.#_rows === undefined) {
      this.#_rows = new Rows(
        this.#table['!rows']
      )
    }
    return this.#_rows
  }
  get cols() {
    if(this.#_cols === undefined) {
      this.#_cols = new Cols(
        this.#table['!cols']   
      )
    }
    return this.#_cols
  }
  get hidden() {
    if(this.#_hidden === undefined) {
      this.#_hidden = new Hidden({
        rows: this.rows,
        cols: this.cols,
      })
    }
    return this.#_hidden
  }
  get merges() {
    if(this.#_merges === undefined) {
      this.#_merges = new Merges({
        merges: this.#table['!merges'],
        hidden: this.hidden,
      })
    }
    return this.#_merges
  }
  get ranges() {
    if(this.#_ranges === undefined) {
      this.#_ranges = new Ranges({
        ranges: this.#table['!ranges'],
        hidden: this.hidden,
      }, this.#options.ranges)
    }
    return this.#_ranges
  }
  get lmnRanges() {
    if(this.#_lmnRanges === undefined) {
      this.#_lmnRanges = new LMNRanges(
        this.ranges.getRangesByName(
          new RegExp(/^LMN_/)
        )
      )
    }
    return this.#_lmnRanges
  }
  get data() {
    if(this.#_data === undefined) {
      this.#_data = new Data({
        data: this.#table['!data'],
        ranges: this.ranges,
        hidden: this.hidden,
      })
    }
    return this.#_data
  }
  get mods() {
    if(this.#_mods === undefined) {
      this.#_mods = new Mods({
        data: this.data,
        ranges: this.ranges,
        merges: this.merges,
      })
    }
    return this.#_mods
  }
  #dataChanged($table) {
    return (
      JSON.stringify(
        $table['!data']
      ) !== JSON.stringify(
        this.#_data.raw
      )
    )
  }
  #rangesChanged($table) {
    return (
      JSON.stringify(
        $table['!ranges']
      ) !== JSON.stringify(
        this.#tableClone['!ranges']
      )
    )
  }
  #rowsChanged($table) {
    return (
      JSON.stringify(
        $table['!rows']
      ) !== JSON.stringify(
        this.#tableClone['!rows']
      )
    )
  }
  #colsChanged($table) {
    return (
      JSON.stringify(
        $table['!cols']
      ) !== JSON.stringify(
        this.#tableClone['!cols']   
      )
    )
  }
  tableHasChanged($table) {
    return (
      this.#dataChanged($table) ||
      this.#rangesChanged($table) ||
      this.#rowsChanged($table) ||
      this.#colsChanged($table) /* ||
      this.#mergesChanged($table) */
    )
  }
}