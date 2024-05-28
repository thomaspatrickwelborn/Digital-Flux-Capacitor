import { EventEmitter } from 'node:events'
import * as fs from 'node:fs'
import chokidar from 'chokidar'
import { createConnection } from 'mongoose'
import * as XLSX from 'xlsx'
import { readFile } from 'node:fs/promises'
import Workbook from './workbook/index.js'

XLSX.set_fs(fs)

class SpreadsheetToSpreadsheetDatabase extends EventEmitter {
	constructor($settings) {
		super()
		this.#settings = $settings
		return this.#start()
	}
	#settings
	async #start() {
		await this.#startDBConnection()
		await this.#startWorkbookWatch()
		return this
	}
	async #stop() {
		await this.#stopWorkbookWatch()
		await this.#stopDBConnection()
		return this
	}
	dbConnection
	async #startDBConnection() {
		if(this.dbConnection === undefined) {
			const { uri, options } = this.#settings.database
			this.dbConnection = await createConnection(uri, options)
			.asPromise()
		}
		return this.dbConnection
	}
	async #stopDBConnection() {
		await this.dbConnection.close()
		this.dbConnection = undefined
		return this.dbConnection
	}
	#_workbook
	get workbook() { return this.#_workbook }
	async #setWorkbook($workbookPath, $workbook) {
		this.#_workbook = await new Workbook({
			workbookPath: $workbookPath, 
			workbook: $workbook,
			dbConnection: this.dbConnection, 
		})
		return this
	}
	async #readWorkbook($workbookPath) {
		const workbookFile = await readFile($workbookPath)
		.then(($buffer) => XLSX.read($buffer, {
			type: 'buffer',
			raw: true,
			dense: true,
			cellStyles: true,
		}))
		await this.#setWorkbook($workbookPath, workbookFile)
		return this
	}
	#workbookWatch
	async #startWorkbookWatch() {
		const { path } = this.#settings.spreadsheet
		this.#workbookWatch = chokidar.watch(path)
		this.#workbookWatch.once('add', this.#workbookWatchChange.bind(this))
		this.#workbookWatch.on('change', this.#workbookWatchChange.bind(this))
		await new Promise(($resolve, $reject) => {
			this.#workbookWatch.on('ready', $resolve)
			this.#workbookWatch.on('error', $reject)
		})
		return this.#workbookWatch
	}
	async #stopWorkbookWatch() {
		await this.#workbookWatch.close()
		this.#workbookWatch = undefined
		return this.#workbookWatch
	}
	async #workbookWatchChange($workbookPath) {
		console.log($workbookPath)
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
		console.log(this)
		// this.emit('output', this)
	}
}

export default SpreadsheetToSpreadsheetDatabase