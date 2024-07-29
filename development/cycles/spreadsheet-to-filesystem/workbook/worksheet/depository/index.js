import { EventEmitter } from 'node:events'
import {
  typeOf, parseCell, tem
} from '#utils/index.js'
import Cols from './cols/index.js'
import Rows from './rows/index.js'
import Hidden from './hidden/index.js'
import Merges from './merges/index.js'
import Ranges from './ranges/index.js'
import Data from './data/index.js'
import LMNRanges from './lmnRanges/index.js'
import Mods from './mods/index.js'

export default class Depository extends EventEmitter {
  #worksheetTable = {}
  #options = {}
  #_rows = []
  #_cols = []
  #_hidden
  #_merges
  #_ranges
  #_lmnRanges
  #_data
  #_mods
  get rows() { return this.#_rows }
  get cols() { return this.#_cols }
  get hidden() { return this.#_hidden }
  get merges() { return this.#_merges }
  get ranges() { return this.#_ranges }
  get lmnRanges() { return this.#_lmnRanges }
  get data() { return this.#_data }
  get mods() { return this.#_mods }
  constructor($worksheetTable, $options) {
    super()
    this.#worksheetTable = $worksheetTable
    this.#options = $options
    this.#_rows = new Rows(
      this.#worksheetTable['!rows']
    )
    this.#_cols = new Cols(
      this.#worksheetTable['!cols']   
    )
    this.#_hidden = new Hidden({
      rows: this.rows,
      cols: this.cols,
    })
    this.#_merges = new Merges({
      merges: this.#worksheetTable['!merges'],
      hidden: this.hidden,
    })
    this.#_ranges = new Ranges({
      ranges: this.#worksheetTable['!ranges'],
      hidden: this.hidden,
    }, this.#options.ranges)
    this.#_lmnRanges = new LMNRanges(
      this.ranges.getRangesByName(
        new RegExp(/^LMN_/)
      ), this.#options.ranges
    )
    this.#_data = new Data({
      data: this.#worksheetTable['!data'],
      ranges: this.ranges,
      hidden: this.hidden,
    })
    this.#_mods = new Mods({
      data: this.data,
      ranges: this.ranges,
      merges: this.merges,
    })
  }
  worksheetTableHasChanged($worksheetTable) {
    return (
      // (
      //   JSON.stringify(
      //     $worksheetTable['!ranges']
      //   ) !== JSON.stringify(
      //     this.#worksheetTable['!ranges']
      //   )
      // ) ||
      // (
      //   JSON.stringify(
      //     $worksheetTable['!rows']
      //   ) !== JSON.stringify(
      //     this.#worksheetTable['!rows']
      //   )
      // ) ||
      // (
      //   JSON.stringify(
      //     $worksheetTable['!cols']
      //   ) !== JSON.stringify(
      //     this.#worksheetTable['!cols']   
      //   )
      // ) ||
      // (
      //   JSON.stringify(
      //     $worksheetTable['!merges']
      //   ) !== JSON.stringify(
      //     this.#worksheetTable['!merges']
      //   )
      // ) ||
      (
        JSON.stringify(
          $worksheetTable['!data']
        ) !== JSON.stringify(
          this.#_data.raw
        )
      )
    )
  }
}