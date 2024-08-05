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
  #worksheetTableClone
  #worksheetTable
  #options
  #_rows
  #_cols
  #_hidden
  #_merges
  #_ranges
  #_lmnRanges
  #_data
  #_mods
  constructor($worksheetTable, $options) {
    super()
    this.#worksheetTableClone = structuredClone($worksheetTable)
    this.#worksheetTable = $worksheetTable
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
        this.#worksheetTable['!rows']
      )
    }
    return this.#_rows
  }
  get cols() {
    if(this.#_cols === undefined) {
      this.#_cols = new Cols(
        this.#worksheetTable['!cols']   
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
        merges: this.#worksheetTable['!merges'],
        hidden: this.hidden,
      })
    }
    return this.#_merges
  }
  get ranges() {
    if(this.#_ranges === undefined) {
      this.#_ranges = new Ranges({
        ranges: this.#worksheetTable['!ranges'],
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
        ), this.#options.ranges
      )
    }
    return this.#_lmnRanges
  }
  get data() {
    if(this.#_data === undefined) {
      this.#_data = new Data({
        data: this.#worksheetTable['!data'],
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
  #dataChanged($worksheetTable) {
    return (
      JSON.stringify(
        $worksheetTable['!data']
      ) !== JSON.stringify(
        this.#_data.raw
      )
    )
  }
  #rangesChanged($worksheetTable) {
    return (
      JSON.stringify(
        $worksheetTable['!ranges']
      ) !== JSON.stringify(
        this.#worksheetTableClone['!ranges']
      )
    )
  }
  #rowsChanged($worksheetTable) {
    return (
      JSON.stringify(
        $worksheetTable['!rows']
      ) !== JSON.stringify(
        this.#worksheetTableClone['!rows']
      )
    )
  }
  #colsChanged($worksheetTable) {
    return (
      JSON.stringify(
        $worksheetTable['!cols']
      ) !== JSON.stringify(
        this.#worksheetTableClone['!cols']   
      )
    )
  }
  // #mergesChanged($worksheetTable) {
  //   return (
  //     JSON.stringify(
  //       $worksheetTable['!merges']
  //     ) !== JSON.stringify(
  //       this.#worksheetTableClone['!merges']
  //     )
  //   )
  // }
  worksheetTableHasChanged($worksheetTable) {
    return (
      this.#dataChanged($worksheetTable) ||
      this.#rangesChanged($worksheetTable) ||
      this.#rowsChanged($worksheetTable) ||
      this.#colsChanged($worksheetTable) /* ||
      this.#mergesChanged($worksheetTable) */
    )
  }
}