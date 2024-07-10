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
	#_watch = false
	constructor($settings) {
		super($settings)
		this.dbConnection = this.settings.input.database
		this.#watch = this.settings.watch
		return this
	}
	get dbConnection() { return this.#_dbConnection }
	set dbConnection($database) {
		if(this.#_dbConnection === undefined) {
			const { uri, options } = $database
			this.#_dbConnection = createConnection(uri, options)
			this.#_dbConnection.once(
				'connected', async function databaseConnected($event) {
					if(this.#watch === true) {
						this.workbookWatch = this.settings.spreadsheet
					} else {
						await this.#workbookWatchChange(this.settings.spreadsheet.path)
						process.exit()
					}
				}.bind(this)
			)
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
	get #watch() { return this.#_watch }
	set #watch($watch) {
		this.#_watch = (
			$watch !== undefined
		) ? $watch
		  : this.#_watch
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
		await this.workbook.saveWorksheets()
		this.emit('output', this)
		return this
	}
	async #workbookWatchChange($workbookPath) {
		// console.clear()
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
	}
}

export default SpreadsheetToSpreadsheetDatabase