import { Schema, Types } from 'mongoose'
import Table from './table/index.js'
import Suppository from './suppository/index.js'
import Compository from './compository/index.js'
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

export default class Worksheet extends EventTarget {
	#settings
	#options
	name
	#dbConnection
	#_suppository
	#_compository
	#_table
	constructor($settings, $options) {
		super()
		this.#settings = $settings
		this.#options = $options
		const {
			worksheetName, worksheetTable, dbConnection
		} = $settings
		this.name = worksheetName
		this.#dbConnection = dbConnection
		this.#table = worksheetTable
		this.#suppository = this.#table
		this.#compository = this.#table
		return
	}
	async start() {
		// await this.#suppository.start()
		throw new Error("!")
		// console.log(this.#suppository)
		// const supposits = await this.#setSupposits()
		// this.#supposits = { mods, ranges, merges, lmnRanges }
		// const schemata = await this.#setSchemata(mods, ranges, merges, lmnRanges)
		// const models = await this.#setModels(mods, ranges, merges, lmnRanges)
		// const composits = await this.#setComposits(mods, ranges, merges, lmnRanges)
		// const collect = await this.#setCollect(mods, ranges, composits, lmnRanges)
		return this
	}
	get #table() { return this.#_table }
	set #table($table) {
		this.#_table = new Table($table, {
			ranges: this.#options.ranges
		})
	}
	get #suppository() { return this.#_suppository }
	set #suppository($suppository) {
		this.#_suppository = new Suppository($suppository, {
			dbConnection: this.#dbConnection
		})
	}
	get #compository() { return this.#_compository }
	set #compository($compository) {
		this.#_compository = new Compository($compository, {
			dbConnection: this.#dbConnection
		})
	}
}
