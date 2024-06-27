import { EventEmitter } from 'node:events'
import {
  typeOf, parseCell, tem
} from '#utils/index.js'
import Ranges from './ranges/index.js'
import LMNRanges from './lmnRanges/index.js'

const Defaults = {
  ModRangeNameRegExp: /^MOD_[0-9]/,
}
const { Row, Col, Range, Cell } = tem
export default class Depository extends EventEmitter {
  #settings = {}
  #options = {}
  #_hidden
  #_rows = []
  #_cols = []
  #_data = []
  #_ranges
  #_lmnRanges
  #_mods = new Map()
  constructor($settings, $options) {
    super()
    this.#settings = $settings
    this.#options = $options
    this.rows = this.#settings['!rows']
    this.cols = this.#settings['!cols']   
    this.ranges = this.#settings['!ranges']
    this.lmnRanges = this.ranges.getRangesByName(
      new RegExp(/^LMN_/)
    )
    this.data = this.#settings['!data']
    this.mods = {
      data: this.data,
      ranges: this.ranges,
    }
    console.log(this)
  }
  get ranges() { return this.#_ranges }
  set ranges($ranges) {
    const hidden = this.hidden
    this.#_ranges = new Ranges(
      Object.assign($ranges, { hidden }), 
      this.#options.ranges
    )
  }
  get lmnRanges() { return this.#_lmnRanges }
  set lmnRanges($lmnRanges) {
    this.#_lmnRanges = new LMNRanges($lmnRanges)
  }
  get hidden() {
    if(this.#_hidden === undefined) {
      const _hidden = { rows: [], cols: [] }
      const rows = this.rows.reduce(
        ($rows, $row, $rowIndex) => {
          if($row.hidden) $rows.push($rowIndex)
          return $rows
        }, _hidden.rows
      ).reverse()
      const cols = this.cols.reduce(
        ($cols, $col, $colIndex) => {
          if($col.hidden) $cols.push($colIndex)
          return $cols
        }, _hidden.cols
      ).reverse()
      this.#_hidden = _hidden
    }
    return this.#_hidden
  }
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
  get data() {
    const _data = this.#_data
    const includeHidden = false
    const condensed = true
    const hidden = this.hidden
    const hiddenRows = hidden.rows
    const hiddenCols = hidden.cols
    const rows = []
    const rowsLength = _data.length
    var rowsIndex = 0
    while(rowsIndex < rowsLength) {
      if(
        includeHidden === false &&
        hiddenRows.includes(rowsIndex) === true
      ) {
        rowsIndex++
        continue
      }
      var row = []
      const colsLength = _data[rowsIndex].length
      var colsIndex = 0
      while(colsIndex < colsLength) {
        if(
          includeHidden === false &&
          hiddenCols.includes(colsIndex) === true
        ) {
          colsIndex++
          continue
        }
        var cell = (
          _data[rowsIndex][colsIndex] !== undefined
        ) ? _data[rowsIndex][colsIndex]
          : new Cell()
        if(condensed === true) {
          if(
            cell.w === 'TRUE' ||
            cell.w === 'FALSE'
          ) {
            cell = parseCell(cell.w)
          } else {
            cell = parseCell(cell.v)
          }
        }
        row.push(cell)
        colsIndex++
      }
      rows.push(row)
      rowsIndex++
    }
    return rows
  }
  set data($data = []) {
    const _data = this.#_data
    if(Object.isFrozen(_data) === false) {
      const areas = this.ranges.getRangesByName('AREA')
      console.log('areas,', areas)
      if(areas.length === 0) return
      const area = areas[0]
      const rowsLength = $data.length
      const maxRowsLength = area.Ref.e.r
      var rowsIndex = 0
      while(rowsIndex < rowsLength) {
        if(rowsIndex > maxRowsLength) break
        const row = []
        const colsLength = (
          $data[rowsIndex] !== undefined
        ) ? $data[rowsIndex].length
          : 0
        const maxColsLength = area.Ref.e.c
        var colsIndex = 0
        while(colsIndex < colsLength) {
          if(colsIndex > maxColsLength) break
          const cell = $data[rowsIndex][colsIndex]
          Object.freeze(cell)
          row.push(cell)
          colsIndex++
        }
        Object.freeze(row)
        _data.push(row)
        rowsIndex++
      }
      Object.freeze(_data)
    }
  }
  get mods() { return this.#_mods }
  set mods($mods) {
    const { data, ranges } = $mods
    const _mods = this.#_mods
    if(Object.isFrozen(_mods) === false) {
      const modRanges = ranges
      .getRangesByName(
        new RegExp(Defaults.ModRangeNameRegExp)
      )
      .sort(($rangeA, $rangeB) => (
        $rangeA.Ref.s.r < $rangeB.Ref.s.r
      ) ? -1
        : 1
      )
      const modRangesLength = modRanges.length
      var modRangesIndex = 0
      var modRangeClassName
      while(modRangesIndex < modRangesLength) {
        var modRange = modRanges[modRangesIndex]
        const { Name, Ref, Class } = modRange
        modRangeClassName = modRangeClassName || Class
        var [$key, $index, $val] = Name.split('_', 3)
        $index = Number($index)
        let mod
        if(_mods.has($index) === true) {
          mod = _mods.get($index) 
        } else {
          _mods.set($index, {
            nom: modRangeClassName, sup: Array, com: Array
          })
          mod = _mods.get($index)
        }
        if(
          $val === 'SUP' ||
          $val === 'COM'
        ) {
          const modRangeRows = data
          .slice(Ref.s.r, Ref.e.r + 1)
          .reduce(($modRangeRows, $modRangeRow) => {
            const modRangeRow = $modRangeRow.slice(
              Ref.s.c, Ref.e.c + 1
            )
            $modRangeRows.push(modRangeRow)
            return $modRangeRows
          }, [])
          var modKey = $val.toLowerCase() 
          mod[modKey] = modRangeRows
        }
        _mods.set($index, mod)
        modRangesIndex++
      }
      Object.freeze(_mods)
    }
  }
}