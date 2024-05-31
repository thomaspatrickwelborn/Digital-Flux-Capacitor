import { EventEmitter } from 'node:events'
import deepmerge from 'deepmerge'
import { Schema, Types } from 'mongoose'
import Table from './table/index.js'
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

class Worksheet extends EventEmitter {
	name
	constructor($settings) {
		super()
		const {
			worksheetName, worksheetTable, dbConnection
		} = $settings
		this.name = worksheetName
		this.#dbConnection = dbConnection
		this.#table = worksheetTable
		return
	}
	async start() {
		const tableData = this.#table.data
		// const ranges = this.getRanges({ includeHidden: false })
		const ranges = this.#table.ranges
		// const lmnRanges = this.getLMNRanges()
		const lmnRanges = this.#table.lmnRanges
		// const merges = this.#getMerges({ includeHidden: false })
		const merges = this.#table.merges
		throw new Error("!")

		// const mods = await this.#setMods(tableData, ranges, merges)
		// const supposits = await this.#setSupposits(mods, ranges, merges, lmnRanges)
		// const schemata = await this.#setSchemata(mods, ranges, merges, lmnRanges)
		// const models = await this.#setModels(mods, ranges, merges, lmnRanges)
		// const composits = await this.#setComposits(mods, ranges, merges, lmnRanges)
		// const collect = await this.#setCollect(mods, ranges, composits, lmnRanges)
		return this
	}
	#_table
	get #table() { return this.#_table }
	set #table($table) { this.#_table = new Table($table)}
	#dbConnection
	get #area() { return this.getRanges().find(
		($range) => $range.Name === 'AREA'
	) }
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
				var schema = new Schema(supposit)
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
				// merges: this.#getMerges({ includeHidden: false }),
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
