import { EventEmitter } from 'node:events'
import Depository from './depository/index.js'
import Suppository from './suppository/index.js'
import Compository from './compository/index.js'
import Extrapository from './extrapository/index.js'
import {
	typeOf, parseCell, tem, combineMerge
} from '#utils/index.js'
import { LMNProps } from '#utils/defaults/index.js'
export default class Worksheet extends EventEmitter {
	#settings
	#options
	name
	className
	#dbConnections
	#_depository
	#_suppository
	#_compository
	#_extrapository
	constructor($settings, $options) {
		super()
		this.#settings = $settings
		this.#options = $options
		const {
			worksheetClassName, 
			worksheetName, 
			worksheetTable, 
			dbConnections
		} = $settings
		this.name = worksheetName
		this.className = worksheetClassName
		this.#dbConnections = dbConnections
		this.depository = worksheetTable
		this.suppository = this.depository
		this.compository = this.depository
		this.extrapository = this.compository
		this.extrapository = {}
		return
	}
	get depository() { return this.#_depository }
	set depository($worksheetTable) {
		this.#_depository = new Depository(
			$worksheetTable, 
			{
				name: this.name,
				className: this.className,
				ranges: this.#options.ranges
			}
		)
	}
	get suppository() { return this.#_suppository }
	set suppository($depository) {
		this.#_suppository = new Suppository(
			$depository, 
			{
				name: this.name,
				className: this.className,
				dbConnections: this.#dbConnections
			}
		)
	}
	get compository() { return this.#_compository }
	set compository($depository) {
		this.#_compository = new Compository(
			$depository, 
			{
				name: this.name,
				className: this.className,
				dbConnections: this.#dbConnections
			}
		)
	}
	get extrapository() { return this.#_extrapository }
	set extrapository($compository) {
		this.#_extrapository = new Extrapository(
			$compository, 
			{
				name: this.name,
				className: this.className,
				dbConnections: this.#dbConnections,
				worksheet: this,
			}
		)
		this.#_extrapository.on(
			'saveCollectDoc', function extrapositorySaveCollectDoc($collectDoc) {
				console.log('$collectDoc', $collectDoc)
			}
		)
	}
	async saveCompository() {
		await this.compository.saveCollects()
		return this
	}
}
