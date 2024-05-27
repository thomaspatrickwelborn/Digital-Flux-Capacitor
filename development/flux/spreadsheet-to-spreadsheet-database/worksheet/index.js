import { EventEmitter } from 'node:events'
import XLSX from 'xlsx'
import deepmerge from 'deepmerge'
import { Schema, Types } from 'mongoose'
import Supposit from './supposit/index.js'
import Composit from './composit/index.js'
import Collect from './collect/index.js'
import {
	typeOf, parseCell, tem, combineMerge
} from '#utils/index.js'
import { LMNProps } from '#utils/defaults/index.js'

const { ObjectId } = Types
const Defaults = {
	GetModsOptions: { includeHidden: true, condensed: false },
	GetMergesOptions: { includeHidden: true },
	GetRangesOptions: { includeHidden: true },
	GetDataOptions: {  condensed: true, includeHidden: true },
	ModRangeNameRegExp: /MOD_[0-9]+_((SUP|COM)|[A-Za-z0-9]+)/,
	OmitRangeNameRegExp: /^OMIT/,
}
const { Row, Col, Range, Cell } = tem

function lmnPropRangeRefsMatch($lmnPropRangeA, $lmnPropRangeB) {
	return (
		$lmnPropRangeA.Ref.s.r === $lmnPropRangeB.Ref.s.r &&
		$lmnPropRangeA.Ref.s.c === $lmnPropRangeB.Ref.s.c &&
		$lmnPropRangeA.Ref.e.r === $lmnPropRangeB.Ref.e.r &&
		$lmnPropRangeA.Ref.s.e === $lmnPropRangeB.Ref.s.e
	) ? true
	  : false
}

class Worksheet extends EventEmitter {
	constructor($settings) {
		super()
		const {
			worksheetName, worksheetData, dbConnection, translexes
		} = $settings
		this.#worksheetData = worksheetData
		this.#dbConnection = dbConnection
		this.name = worksheetName
		this.#setRanges(worksheetData['!ranges'])
		this.#setRows(worksheetData['!rows'])
		this.#setCols(worksheetData['!cols'])
		this.#setMerges(worksheetData['!merges'])
		this.#setData(worksheetData['!data'])
		return this.#generateCollections()
	}
	async #generateCollections() {
		const data = this.#getData({ includeHidden: false, condensed: true })
		const ranges = this.getRanges({ includeHidden: false })
		const lmnRanges = this.getLMNRanges(ranges)
		const merges = this.#getMerges({ includeHidden: false })
		const mods = await this.#setMods(data, ranges, merges)
		const supposits = await this.#setSupposits(mods, ranges, merges, lmnRanges)
		const schemata = await this.#setSchemata(mods, ranges, merges, lmnRanges)
		const models = await this.#setModels(mods, ranges, merges, lmnRanges)
		const composits = await this.#setComposits(mods, ranges, merges, lmnRanges)
		const collect = await this.#setCollect(mods, ranges, composits, lmnRanges)
		return this
	}
	#worksheetData
	#dbConnection
	get #area() { return this.getRanges().find(
		($range) => $range.Name === 'AREA'
	) }
	name
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
	#setRows($rows = []) {
		const rows = this.#_rows
		if(Object.isFrozen(rows) === false) {
			$rows = structuredClone($rows)
			const rowsLength = $rows.length
			var rowsIndex = 0
			while(rowsIndex < rowsLength) {
				var row = (
					typeOf($rows[rowsIndex]) === 'undefined'
				) ? new Row()
				  : $rows[rowsIndex]
			  Object.freeze(row)
				rows.push(row)
				rowsIndex++
			}
			Object.freeze(rows)
		}
		return rows
	}
	#_cols = []
	get #cols() { return this.#_cols }
	#setCols($cols = []) {
		const cols = this.#_cols
		if(Object.isFrozen(cols) === false) {
			$cols = structuredClone($cols)
			const colsLength = $cols.length
			var colsIndex = 0
			while(colsIndex < colsLength) {
				var col = (
					typeOf($cols[colsIndex]) === 'undefined'
				) ? new Col()
				  : $cols[colsIndex]
			  Object.freeze(col)
				cols.push(col)
				colsIndex++
			}
			Object.freeze(cols)
		}
		return cols
	}
	#_data = []
	get data() { return this.#_data }
	#getData($options = Defaults.GetDataOptions) {
		const { includeHidden, condensed } = $options
		const hidden = this.#hidden
		const hiddenRows = hidden.rows
		const hiddenCols = hidden.cols
		const rows = []
		const rowsLength = this.#_data.length
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
			const colsLength = this.#_data[rowsIndex].length
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
			  	this.#_data[rowsIndex][colsIndex] !== undefined
		  	) ? this.#_data[rowsIndex][colsIndex]
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
	#setData($data = [], $options) {
		const data = this.#_data
		if(Object.isFrozen(data) === false) {
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
				data.push(row)
				rowsIndex++
			}
			Object.freeze(data)
		}
		return (
			$options !== undefined
		) ? this.#getData()
		  : this.#getData($options)
	}
	getLMNRanges($ranges) {
		const lmnRanges = $ranges
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
			const lmn = $ranges
			.find(($range) => $range.Name.match(lmnRegExp))
			if(lmn === undefined) continue iterateLMNRangeProp
			$lmnRangeProps['LMN'] = lmn
			// SUPSET
			const lmnSupsetRegExp = new RegExp(`^${$lmnRangeName}_SUPSET`)
			const lmnSupset = $ranges
			.find(($range) => $range.Name.match(lmnSupsetRegExp))
			if(lmnSupset !== undefined) {
				$lmnRangeProps['SUPSET'] = {
					Name: lmnSupset.Name,
					Ref: lmnSupset.Ref,
				}
				const lmnSupsetRefMatchesLMNRef = lmnPropRangeRefsMatch(lmn, lmnSupset)
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
			const lmnSubset = $ranges
			.find(($range) => $range.Name.match(lmnSubsetRegExp))
			if(lmnSubset !== undefined) {
				$lmnRangeProps['SUBSET'] = {
					Name: lmnSubset.Name,
					Ref: lmnSubset.Ref,
				}
				const lmnSubsetRefMatchesLMNRef = lmnPropRangeRefsMatch(lmn, lmnSubset)
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
			const lmnPat = $ranges
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
	ranges = []
	getRanges($options = Defaults.GetRangesOptions) {
		const { includeHidden } = $options
		const _ranges = this.ranges
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
	#setRanges($ranges, $options) {
		const ranges = this.ranges
		if(Object.isFrozen(ranges) === false) {
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
				ranges.push(range)
				rangesIndex++
			}
			Object.freeze(ranges)
		}
		return (
			$options !== undefined
		) ? this.getRanges($options)
		  : this.getRanges()
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
	merges = []
	#getMerges($options = Defaults.GetMergesOptions) {
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
	#setMerges($merges) {
		this.merges = $merges
		Object.freeze(this.merges)
		return this.#getMerges()
	}
	mods = new Map()
	async #setMods($data = [], $ranges, $merges) {
		const mods = this.mods
		if(Object.isFrozen(mods) === false) {
			const modRanges = $ranges
			.filter(($range) => $range.Name.match(
				new RegExp(Defaults.ModRangeNameRegExp)
			) !== null)
			.sort(($rangeA, $rangeB) => (
				$rangeA.Ref.s.r < $rangeB.Ref.s.r
			) ? -1
			  : 1
		  )
			const modRangesLength = modRanges.length
			var modRangesIndex = 0
			while(modRangesIndex < modRangesLength) {
				const modRange = modRanges[modRangesIndex]
				const { Name, Ref } = modRange
				var [$key, $index, $val] = Name.split('_', 3)
				$index = Number($index)
				var mod = (
					mods.has($index) === true
				) ? mods.get($index) 
				  : mods.set($index, {
					nom: String, sup: Array, com: Array
				}).get($index)
				if(
					$val === 'SUP' ||
					$val === 'COM'
				) {
					const modRangeRows = $data
				  .slice(Ref.s.r, Ref.e.r + 1)
				  .reduce(($modRangeRows, $modRangeRow) => {
				  	const modRangeRow = $modRangeRow.slice(Ref.s.c, Ref.e.c + 1)
				  	$modRangeRows.push(modRangeRow)
				  	return $modRangeRows
				  }, [])
					var modKey = $val.toLowerCase() 
					mod[modKey] = modRangeRows
				} else {
					mod.nom = $val
				}
				mods.set($index, mod)
				modRangesIndex++
			}
			Object.freeze(mods)
		}
		return this.mods
	}
	schemata = new Map()
	async #setSchemata($mods, $ranges, $merges) {
		$mods = Array.from($mods.entries())
		const supposits = this.supposits
		const modsLength = $mods.length
		var modsIndex = 0
		const schemata = this.schemata
		while(modsIndex < modsLength) {
			var [$modIndex, $mod] = $mods[modsIndex]
			var { nom } = $mod
			const supposit = supposits.get(nom)
			if(schemata.has(nom) === false) {
				var schema = new Schema(supposit, {
					strict: false,
					validateBeforeSave: false,
				})
			  schemata.set(nom, schema)
			}
			modsIndex++
		}
		return schemata
	}
	supposits = new Map()
	async #setSupposits($mods, $ranges, $merges, $lmnRanges) {
		$mods = Array.from($mods.entries())
		const modsLength = $mods.length
		var modsIndex = 0
		const supposits = this.supposits
		while(modsIndex < modsLength) {
			var [$modIndex, $mod] = $mods[modsIndex]
			var { nom, sup, com } = $mod
			var supposit = await Supposit({
				nom, sup, com, 
				modIndex: $modIndex, 
				mods: $mods,
				ranges: $ranges, 
				lmnRanges: $lmnRanges,
				merges: this.#getMerges({ includeHidden: false }),
			})
			supposits.set(nom, deepmerge(
				supposits.get(nom) || {},
				supposit,
				{ arrayMerge: combineMerge },
			))
			modsIndex++
		}
		return supposits
	}
	models = new Map()
	async #setModels($mods, $ranges, $merges) {
		$mods = Array.from($mods.entries())
		const schemata = this.schemata
		const modsLength = $mods.length
		var modsIndex = 0
		const models = this.models
		while(modsIndex < modsLength) {
			var [$modIndex, $mod] = $mods[modsIndex]
			var { nom, sup, com } = $mod
			var schema = schemata.get(nom)
			if(models[nom] === undefined) {
				var model = this.#dbConnection.model(nom, schema)
				models.set(nom, model)
			}
			modsIndex++
		}
		return models
	}
	composits = new Map()
	async #setComposits($mods, $ranges, $merges, $lmnRanges) {
		$mods = Array.from($mods.entries())
		const composits = this.composits
		const modsLength = $mods.length	
		var modsIndex = 0
		while(modsIndex < modsLength) {
			const [$modIndex, $mod] = $mods[modsIndex]
			const {
				nom, sup, com
			} = $mod
			var composit = await Composit({
				nom, sup, com, 
				ranges: $ranges, 
				lmnRanges: $lmnRanges, 
				modIndex: modsIndex, 
				mods: $mods,
				merges: $merges,
			})
			composits.set($modIndex, composit)
			modsIndex++
		}
		return composits
	}
	collect
	async #setCollect($mods, $ranges, $composits, $lmnRanges) {
		$mods = Array.from($mods.entries())
		$composits = Array.from($composits.entries())
		this.collect = await Collect({
			mods: $mods, 
			composits: $composits, 
			dbConnection: this.#dbConnection,
			ranges: $ranges,
			lmnRanges: $lmnRanges,
		})
		return this.collect
	}
}

export default Worksheet
