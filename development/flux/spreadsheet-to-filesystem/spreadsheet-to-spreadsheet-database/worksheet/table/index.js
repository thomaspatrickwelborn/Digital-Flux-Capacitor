import {
  typeOf, parseCell, tem
} from '#utils/index.js'
import XLSX from 'xlsx'
const Defaults = {
  GetModsOptions: { includeHidden: true, condensed: false },
  GetMergesOptions: { includeHidden: true },
  GetRangesOptions: { includeHidden: true },
  GetDataOptions: { includeHidden: false, condensed: true },
  ModRangeNameRegExp: /MOD_[0-9]+_((SUP|COM)|[A-Za-z0-9]+)/,
  OmitRangeNameRegExp: /^OMIT/,
}
const { Row, Col, Range, Cell } = tem
export default class extends EventTarget {
  constructor($settings) {
    super()
    this.settings = $settings
    this.ranges = this.settings['!ranges']
    this.#rows = this.settings['!rows']
    this.#cols = this.settings['!cols']
    this.#merges = this.settings['!merges']
    this.#data = this.settings['!data']
  }
  #_settings
  get settings() { return this.#_settings }
  set settings($settings) { this.#_settings = Object.freeze($settings) }
  #_hidden
  get #hidden() {
    if(this.#_hidden === undefined) {
      const hidden = { rows: [], cols: [] }
      const rows = this.#rows.reduce(($rows, $row, $rowIndex) => {
        if($row.hidden === true) $rows.push($rowIndex)
        return $rows
      }, hidden.rows).reverse()
      const cols = this.#cols.reduce(($cols, $col, $colIndex) => {
        if($col.hidden === true) $cols.push($colIndex)
        return $cols
      }, hidden.cols).reverse()
      this.#_hidden = hidden
    }
    return this.#_hidden
  }
  #_rows = []
  get #rows() { return this.#_rows }
  set #rows($rows = []) {
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
  #_cols = []
  get #cols() { return this.#_cols }
  set #cols($cols = []) {
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
  #_data = []
  get data() {
    const $options = Defaults.GetDataOptions
    const _data = this.#_data
    const { includeHidden, condensed } = $options
    const hidden = this.#hidden
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
  set #data($data = []) {
    const _data = this.#_data
    if(Object.isFrozen(_data) === false) {
      const area = this.ranges.find(
        ($range) => $range.Name === 'AREA'
      )
      if(area === undefined) return
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
    return (
      $options !== undefined
    ) ? this.getData()
      : this.getData($options)
  }
  #lmnPropRangeRefsMatch($lmnPropRangeA, $lmnPropRangeB) {
    return (
      $lmnPropRangeA.Ref.s.r === $lmnPropRangeB.Ref.s.r &&
      $lmnPropRangeA.Ref.s.c === $lmnPropRangeB.Ref.s.c &&
      $lmnPropRangeA.Ref.e.r === $lmnPropRangeB.Ref.e.r &&
      $lmnPropRangeA.Ref.s.e === $lmnPropRangeB.Ref.s.e
    ) ? true
      : false
  }
  lmnRanges() {
    const lmnRanges = this.ranges
    .reduce(
      ($lmnRanges, $range) => {
        if($range.Name.match(/^LMN_[0-9]$/)) {
          const lmnRangeID = Number($range.Name.split('_')[1])
          $lmnRanges[lmnRangeID] = [$range.Name, {}]
        }
        return $lmnRanges
      }, []
    )
    iterateLMNRangeProp: for(const [
      $lmnRangeName, $lmnRangeProps
    ] of lmnRanges) {
      // LMN
      const lmnRegExp = new RegExp(`${$lmnRangeName}`)
      const lmn = this.ranges
      .find(($range) => $range.Name.match(lmnRegExp))
      if(lmn === undefined) continue iterateLMNRangeProp
      $lmnRangeProps['LMN'] = lmn
      // SUPSET
      const lmnSupsetRegExp = new RegExp(`^${$lmnRangeName}_SUPSET`)
      const lmnSupset = this.ranges
      .find(($range) => $range.Name.match(lmnSupsetRegExp))
      if(lmnSupset !== undefined) {
        $lmnRangeProps['SUPSET'] = {
          Name: lmnSupset.Name,
          Ref: lmnSupset.Ref,
        }
        const lmnSupsetRefMatchesLMNRef = this.#lmnPropRangeRefsMatch(lmn, lmnSupset)
        const lmnSupsetNameData = lmnSupset.Name.split('_')
        var lmnSupsetPropKey
        if(
          lmnSupsetRefMatchesLMNRef === true &&
          lmnSupsetNameData.length === 4
        ) {
          $lmnRangeProps['SUPSET'].Key = lmnSupsetNameData[3]
        } /* else if(
          lmnSupsetRefMatchesLMNRef === false &&
          lmnSupsetNameData.length === 4
        ) {
          $lmnRangeProps['SUPSET'].$Key = lmnSupsetNameData[3]
        } */ else if(
          lmnSupsetRefMatchesLMNRef === true &&
          lmnSupsetNameData.length === 3
        ) {
          $lmnRangeProps['SUPSET'].Key = LMNProps['LMN_SUPSET'].key
        }
        if(lmnSupsetPropKey !== undefined) {
        }
      }
      // SUBSET
      const lmnSubsetRegExp = new RegExp(`^${$lmnRangeName}_SUBSET`)
      const lmnSubset = this.ranges
      .find(($range) => $range.Name.match(lmnSubsetRegExp))
      if(lmnSubset !== undefined) {
        $lmnRangeProps['SUBSET'] = {
          Name: lmnSubset.Name,
          Ref: lmnSubset.Ref,
        }
        const lmnSubsetRefMatchesLMNRef = this.#lmnPropRangeRefsMatch(lmn, lmnSubset)
        const lmnSubsetNameData = lmnSubset.Name.split('_')
        var lmnSubsetPropKey
        if(
          lmnSubsetRefMatchesLMNRef === true &&
          lmnSubsetNameData.length === 4
        ) {
          $lmnRangeProps['SUBSET'].Key = lmnSubsetNameData[3]
        } /* else if(
          lmnSubsetRefMatchesLMNRef === false &&
          lmnSubsetNameData.length === 4
        ) {
          $lmnRangeProps['SUBSET'].$Key = lmnSubsetNameData[3]
        } */ else if(
          lmnSubsetRefMatchesLMNRef === true &&
          lmnSubsetNameData.length === 3
        ) {
          $lmnRangeProps['SUBSET'].Key = LMNProps['LMN_SUBSET'].key
        }
      }
      // PAT
      const lmnPatRegExp = new RegExp(`${$lmnRangeName}_PAT_`)
      const lmnPat = this.ranges
      .find(($range) => $range.Name.match(lmnPatRegExp))
      if(lmnPat !== undefined) {
        $lmnRangeProps['PAT'] = {
          Key: lmnPat.Name.replace(lmnPatRegExp, ''),
          Name: lmnPat.Name,
          Ref: lmnPat.Ref,
        }
      }
    }
    return lmnRanges
  }
  #_ranges = []
  get ranges() {
    const $options = Defaults.GetRangesOptions
    const { includeHidden } = $options
    const _ranges = this.#_ranges
    const ranges = []
    const rangesLength = _ranges.length
    var rangesIndex = 0
    while(rangesIndex < rangesLength) {
      const range = _ranges[rangesIndex]
      const { Name, Ref } = range
      if(includeHidden === false) {
        const hidden = this.#hidden
        const hiddenRows = hidden.rows
        const hiddenRowsLength = hiddenRows.length
        const hiddenCols = hidden.cols
        const hiddenColsLength = hiddenCols.length
        var hiddenRowsIndex = 0
        while(hiddenRowsIndex < hiddenRowsLength) {
          const $hiddenRowIndex = hiddenRows[hiddenRowsIndex]
          if($hiddenRowIndex < Ref.s.r) {
            if(Ref.s.r - 1 < 0) {
              if(Ref.e.r - 1 < 0) {
                Ref.s.r = -1
                Ref.e.r = -1
              } else {
                Ref.s.r = 0
                Ref.e.r -= 1
              }
            } else {
              Ref.s.r -= 1
              Ref.e.r -= 1
            }
          } else if(
            $hiddenRowIndex >= Ref.s.r &&
            $hiddenRowIndex <= Ref.e.r
          ) {
            if(Ref.e.r - 1 < Ref.s.r) {
              Ref.s.r = -1
              Ref.e.r = -1
            } else {
              Ref.e.r -= 1
            }
          }
          hiddenRowsIndex++
        }
        var hiddenColsIndex = 0
        while(hiddenColsIndex < hiddenColsLength) {
          const $hiddenColIndex = hiddenCols[hiddenColsIndex]
          if($hiddenColIndex < Ref.s.c) {
            if(Ref.s.c - 1 < 0) {
              if(Ref.e.c - 1 < 0) {
                Ref.s.c = -1
                Ref.e.c = -1
              } else {
                Ref.s.c = 0
                Ref.e.c -= 1
              }
            } else {
              Ref.s.c -= 1
              Ref.e.c -= 1
            }
          } else if(
            $hiddenColIndex >= Ref.s.c &&
            $hiddenColIndex <= Ref.e.c
          ) {
            if(Ref.e.c - 1 < Ref.s.c) {
              Ref.s.c = -1
              Ref.e.c = -1
            } else {
              Ref.e.c -= 1
            }
          }
          hiddenColsIndex++
        }
        if((
          Ref.s.r !== -1 &&
          Ref.e.r !== -1
        ) && (
          Ref.s.c !== -1 &&
          Ref.e.c !== -1
        )) ranges.push(range)
      } else {
        ranges.push(range)
      }
      rangesIndex++
    }
    return ranges
  }
  set ranges($ranges) {
    const _ranges = this._ranges
    if(Object.isFrozen(_ranges) === false) {
      const rangesLength = $ranges.length
      var rangesIndex = 0
      while(rangesIndex < rangesLength) {
        const range = $ranges[rangesIndex]
        const rangeRefFrags = range.Ref.split('!')
        const rangeRefFragsIndex = rangeRefFrags.length - 1
        const rangeRef = XLSX.utils.decode_range(
          rangeRefFrags[rangeRefFragsIndex]
        )
        range.Ref = rangeRef
        Object.freeze(range)
        _ranges.push(range)
        rangesIndex++
      }
      Object.freeze(_ranges)
    }
    return this.ranges
  }
  #getRangesByName($rangeName, $rangesOptions) {
    var ranges
    if(typeOf($rangeName) === 'string') {
      ranges = this.getRanges($rangesOptions).filter(
        ($range) => $range.Name === $rangeName
      )
    } else if($rangeName instanceof RegExp) {
      ranges = this.getRanges($rangesOptions).filter(
        ($modRange) => $modRange.Name.match($rangeName)
      )
    }
    return ranges
  }
  #_merges = []
  get #merges() {
    const $options = Defaults.GetMergesOptions
    const { includeHidden } = $options
    if(includeHidden === true) return this.merges
    const merges = []
    const mergesLength = this.merges.length
    var mergesIndex = 0
    while(mergesIndex < mergesLength) {
      const merge = structuredClone(this.merges[mergesIndex])
      if(includeHidden === false) {
        const hidden = this.#hidden
        const hiddenRows = hidden.rows
        const hiddenRowsLength = hiddenRows.length
        const hiddenCols = hidden.cols
        const hiddenColsLength = hiddenCols.length
        var hiddenRowsIndex = 0
        while(hiddenRowsIndex < hiddenRowsLength) {
          const $hiddenRowIndex = hiddenRows[hiddenRowsIndex]
          if($hiddenRowIndex < merge.s.r) {
            if(merge.s.r - 1 < 0) {
              if(merge.e.r - 1 < 0) {
                merge.s.r = -1
                merge.e.r = -1
              } else {
                merge.s.r = 0
                merge.e.r -= 1
              }
            } else {
              merge.s.r -= 1
              merge.e.r -= 1
            }
          } else if(
            $hiddenRowIndex >= merge.s.r &&
            $hiddenRowIndex <= merge.e.r
          ) {
            if(merge.e.r - 1 < merge.s.r) {
              merge.s.r = -1
              merge.e.r = -1
            } else {
              merge.e.r -= 1
            }
          }
          hiddenRowsIndex++
        }
        var hiddenColsIndex = 0
        while(hiddenColsIndex < hiddenColsLength) {
          const $hiddenColIndex = hiddenCols[hiddenColsIndex]
          if($hiddenColIndex < merge.s.c) {
            if(merge.s.c - 1 < 0) {
              if(merge.e.c - 1 < 0) {
                merge.s.c = -1
                merge.e.c = -1
              } else {
                merge.s.c = 0
                merge.e.c -= 1
              }
            } else {
              merge.s.c -= 1
              merge.e.c -= 1
            }
          } else if(
            $hiddenColIndex >= merge.s.c &&
            $hiddenColIndex <= merge.e.c
          ) {
            if(merge.e.c - 1 < merge.s.c) {
              merge.s.c = -1
              merge.e.c = -1
            } else {
              merge.e.c -= 1
            }
          }
          hiddenColsIndex++
        }
        if((
          merge.s.r !== -1 &&
          merge.e.r !== -1
        ) && (
          merge.s.c !== -1 &&
          merge.e.c !== -1
        )) merges.push(merge)
      } else {
        merges.push(merge)
      }
      mergesIndex++
    }
    return merges
  }
  set #merges($merges) {
    this.#_merges = $merges
    Object.freeze(this.#_merges)
  }
}