import deepmerge from 'deepmerge'
import { Schema, Types } from 'mongoose'
import Table from './table/index.js'
import Suppository from './suppository/index.js'
import Compository from './compository/index.js'
import Ranges from './ranges/index.js'
import LMNRanges from './lmnRanges/index.js'
import Merges from './merges/index.js'
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

class Worksheet extends EventTarget {
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
		// const mods = await this.#setMods(tableData, ranges, merges)
		this.#mods = { tableData, ranges, merges }
		const mods = this.#mods
		// const supposits = await this.#setSupposits(mods, ranges, merges, lmnRanges)
		this.#supposits = { mods, ranges, merges, lmnRanges }
		console.log(this.#supposits)
		throw new Error("!")
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
	
	schemata = new Map()

	#_supposits = new Map()
	set #supposits($supposits) {
		this.#_supposits = new Suppository($supposits)
	}

	composits = new Map()
	async #setComposits($composits) {

	}
	collect
	
}

export default Worksheet
