import { EventEmitter } from 'node:events'
import chokidar from 'chokidar'
import { createConnection } from 'mongoose'
import * as XLSX from 'xlsx'
import { readFile } from 'node:fs/promises'
import Subcycle from '#core/subcycle/index.js'
import Workbook from './workbook/index.js'

class SpreadsheetToSpreadsheetDatabase extends Subcycle {
	#_dbConnection
	#_workbook
	#_workbookWatch
	constructor($settings) {
		super($settings)
		this.dbConnection = this.settings.database
		this.#_dbConnection.once(
			'connected', function databaseConnected($event) {
				this.workbookWatch = this.settings.spreadsheet
			}.bind(this)
		)
		return this
	}
	get dbConnection() { return this.#_dbConnection }
	set dbConnection($database) {
		if(this.#_dbConnection === undefined) {
			const { uri, options } = $database
			this.#_dbConnection = createConnection(uri, options)
		}
	}
	get workbook() { return this.#_workbook }
	set workbook($workbook) {
		const { path, worksheets } = this.settings.spreadsheet
		const dbConnection = this.dbConnection
		this.#_workbook = new Workbook({
			worksheets,
			workbookPath: path, 
			workbook: $workbook,
			dbConnection, 
		})
	}
	get workbookWatch() { return this.#_workbookWatch }
	set workbookWatch($workbookWatch) {
		const { path } = this.settings.spreadsheet
		this.#_workbookWatch = chokidar.watch(path)
		this.workbookWatch.once(
			'add', this.#workbookWatchChange.bind(this)
		)
		this.workbookWatch.on(
			'change', this.#workbookWatchChange.bind(this)
		)
	}
	async #readWorkbook($workbookPath) {
		const workbookFile = await readFile($workbookPath)
		.then(($buffer) => XLSX.read($buffer, {
			type: 'buffer',
			raw: true,
			dense: true,
			cellStyles: true,
		}))
		this.workbook = workbookFile
		return this
	}
	async #workbookWatchChange($workbookPath) {
		await this.dbConnection.dropDatabase()
		const modelNames = this.dbConnection.modelNames()
		const modelNamesLength = modelNames.length
		var modelNamesIndex = 0
		while(modelNamesIndex < modelNamesLength) {
			const modelName = modelNames[modelNamesIndex]
			await this.dbConnection.deleteModel(modelName)
			modelNamesIndex++
		}
		await this.#readWorkbook($workbookPath)
		this.emit('output', this)
	}
}

export default SpreadsheetToSpreadsheetDatabase