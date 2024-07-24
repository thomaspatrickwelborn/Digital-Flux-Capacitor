import { Timer } from '#utils/index.js'
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
		this.#watch = this.settings.input.spreadsheet.watch
		this.dbConnection = this.settings.input.database
		return this
	}
	get dbConnection() { return this.#_dbConnection }
	set dbConnection($database) {
		if(this.#_dbConnection === undefined) {
			const { uri, options } = $database
			this.#_dbConnection = createConnection(uri, options)
			this.#_dbConnection.once(
				'connected', async function databaseConnected() {
					if(this.#watch === true) {
						this.workbookWatch = this.settings.input.spreadsheet
					} else {
						await this.#workbookWatchChange(
							this.settings.input.spreadsheet.path
						)
						process.exit()
					}
				}.bind(this)
			)
		}
	}
	get workbook() { return this.#_workbook }
	set workbook($workbook) {
		if(this.#_workbook instanceof Workbook) {
			this.#_workbook.workbook = $workbook
			this.#_workbook.worksheets = this.settings.spreadsheet.worksheets
		} else
		if(this.#_workbook === undefined) {
			this.#_workbook = new Workbook({
				worksheets: this.settings.spreadsheet.worksheets,
				workbookPath: this.settings.input.spreadsheet.path, 
				workbook: $workbook,
				dbConnection: this.dbConnection, 
			})
			this.#_workbook.on('worksheet:save', ($worksheet) => {
				this.emit('output', {
					type: 'worksheet:save',
					worksheet: $worksheet
				})
			})
		}
	}
	get workbookWatch() { return this.#_workbookWatch }
	set workbookWatch($workbookWatch) {
		const { path } = $workbookWatch
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
			cellFormula: false,
			cellHTML: false,
			cellNF: false,
			cellDates: false,
			cellStyles: true, // hidden property is a cell style
		}))
		this.workbook = workbookFile
		await this.workbook.saveWorksheets()
		this.emit('output', {
			type: 'subcycle:output',
			subcycle: this
		})
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