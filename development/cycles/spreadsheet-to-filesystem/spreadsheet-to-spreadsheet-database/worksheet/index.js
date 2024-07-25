import { EventEmitter } from 'node:events'
import { Schema, Types } from 'mongoose'
import Depository from './depository/index.js'
import Suppository from './suppository/index.js'
import Compository from './compository/index.js'
import Intrapository from './intrapository/index.js'
import {
	typeOf, parseCell, tem, combineMerge
} from '#utils/index.js'
import { LMNProps } from '#utils/defaults/index.js'
const { ObjectId } = Types

export default class Worksheet extends EventEmitter {
	#settings
	#options
	name
	className
	#dbConnection
	#_suppository
	#_compository
	#_depository
	constructor($settings, $options) {
		super()
		this.#settings = $settings
		this.#options = $options
		const {
			worksheetClassName, 
			worksheetName, 
			worksheetTable, 
			dbConnection
		} = $settings
		this.name = worksheetName
		this.className = worksheetClassName
		this.#dbConnection = dbConnection
		this.depository = worksheetTable
		this.suppository = this.depository
		this.compository = this.depository
		return
	}
	get depository() { return this.#_depository }
	set depository($depository) {
		this.#_depository = new Depository($depository, {
			ranges: this.#options.ranges
		})
	}
	get suppository() { return this.#_suppository }
	set suppository($suppository) {
		this.#_suppository = new Suppository($suppository, {
			dbConnection: this.#dbConnection
		})
	}
	get compository() { return this.#_compository }
	set compository($compository) {
		this.#_compository = new Compository($compository, {
			dbConnection: this.#dbConnection
		})
	}
	async saveCompository() {
		await this.compository.saveCollects()
		return this
	}
}
