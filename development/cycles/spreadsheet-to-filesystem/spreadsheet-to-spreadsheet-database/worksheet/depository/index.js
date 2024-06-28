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
    this.#_rows = new Rows(
      this.#settings['!rows']
    )
    this.#_cols = new Cols(
      this.#settings['!cols']   
    )
    this.#_hidden = new Hidden({
      rows: this.rows,
      cols: this.cols,
    })
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
  get cols() { return this.#_cols }
  get hidden() { return this.#_hidden }
}