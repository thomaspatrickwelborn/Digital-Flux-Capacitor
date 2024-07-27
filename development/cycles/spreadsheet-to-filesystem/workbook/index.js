import { EventEmitter } from 'node:events'
import path from 'path'
import Worksheet from './worksheet/index.js'

class Workbook extends EventEmitter {
	#workbookPath
	#_workbook
	#_worksheets = new Map()
	name
	#settings
	#dbConnections
	fsElementWorksheets
	fsElementContentWorksheets
	constructor($settings) {
		super()
		this.#settings = $settings
		const {
			workbookPath, workbook, worksheets, dbConnections
		} = this.#settings
		this.#dbConnections = dbConnections
		this.#workbookPath = workbookPath
		this.name = path.basename(this.#workbookPath).split('.')[0]
		this.workbook = workbook
		this.createFSElementWorksheets()
		this.createFSElementContentWorksheets()
	}
	get workbook() { return this.#_workbook }
	set workbook($workbook) {
		this.#_workbook = Object.freeze($workbook)
	}
	get worksheets() { return this.#_worksheets }
	createFSElementWorksheets() {
		this.fsElementWorksheets = new Map(
			this.#createWorksheets(
				this.#getWorksheetsByClassName(
					new RegExp(/^VINE/)
				)
			)
		)
		return this.fsElementWorksheets
	}
	async saveFSElementWorksheets() {
		await this.saveWorksheets(this.fsElementWorksheets)
		return this
	}
	createFSElementContentWorksheets() {
		this.fsElementContentWorksheets = this.#createWorksheets(
			this.#getWorksheetsByClassName(
				new RegExp(/^VANT|^VELI|^VERS|^VIEW|^VORM/)
			)
		)
		return this.fsElementContentWorksheets
	}
	async saveFSElementContentWorksheets() {
		await this.saveWorksheets(this.fsElementWorksheets)
		return this
	}
	#getWorksheetsByClassName($workbookWorksheetClassName) {
		const { Workbook, Sheets } = this.workbook
		const worksheets = Workbook.Sheets
		.filter(($workbookWorksheet) => {
			return $workbookWorksheet.name.match(
				$workbookWorksheetClassName
				)
		})
		return worksheets
	}
	#createWorksheets($worksheets) {
		const worksheets = []
		const worksheetsLength = $worksheets.length
		var worksheetsIndex = 0
		iterateWorksheets: 
		while(worksheetsIndex < worksheetsLength) {
			const worksheet = this.#createWorksheet(
				$worksheets[worksheetsIndex]
			)
			if(worksheet !== undefined) {
				worksheets.push(worksheet)
			}
			worksheetsIndex++
		}
		return new Map(worksheets)
	}
	#createWorksheet($worksheet) {
		const hidden = $worksheet.Hidden
		if(hidden) return
		const dbConnections = this.#dbConnections
		const { Workbook, Sheets } = this.workbook
		const worksheetNameData = $worksheet.name.split('_')
		const worksheetClassName = worksheetNameData[0] 
		const worksheetName = $worksheet.name
		const worksheetHidden = $worksheet.Hidden
		const worksheetID = Number($worksheet.sheetId)
		const worksheetTable = Sheets[worksheetName]
		const worksheetRows = worksheetTable['!rows'] || []
		const worksheetCols = worksheetTable['!cols'] || []
		const worksheetMerges = worksheetTable['!merges'] || []
		const worksheetRanges = Workbook.Names.reduce((
			$worksheetRanges, $worksheetRange
		) => {
			if(
				$worksheetRange.Sheet === undefined || 
				$worksheetRange.Sheet === worksheetID - 1
			) $worksheetRanges.push($worksheetRange)
			return $worksheetRanges
		}, [])
		const worksheetOptions = this.#settings.worksheets[
			worksheetClassName
		] || {}
		worksheetTable['!rows'] = worksheetRows
		worksheetTable['!cols'] = worksheetCols
		worksheetTable['!merges'] = worksheetMerges
		worksheetTable['!ranges'] = worksheetRanges
		const worksheet = new Worksheet({
			worksheetClassName,
			worksheetName,
			worksheetTable,
			dbConnections,
		}, worksheetOptions)
		worksheet.on(
			'extrapository:saveCollectDoc',
			this.#worksheetExtrapositorySaveCollectDoc.bind(this)
		)
		worksheet.on(
			'extrapository:saveCollect',
			this.#worksheetExtrapositorySaveCollect.bind(this)
		)
		worksheet.on(
			'extrapository:save',
			this.#worksheetExtrapositorySave.bind(this)
		)
		this.worksheets
		.set(worksheetName, worksheet)
		return [worksheetName, worksheet]
	}
	#worksheetExtrapositorySaveCollectDoc($collectDoc) {
		this.emit('worksheet:saveCollectDoc', $collectDoc)
	}
	#worksheetExtrapositorySaveCollect($collect) {
		this.emit('worksheet:saveCollect', $collect)
	}
	#worksheetExtrapositorySave($collect) {
		this.emit('worksheet:save', $collect)
	}
	async saveWorksheets($worksheets) {
		const worksheets = []
		for(const $worksheet of $worksheets) {
			const worksheet = await this.saveWorksheet($worksheet)
			worksheets.push(worksheet)
		}
		return new Map(worksheets)
	}
	async saveWorksheet($worksheet) {
		const worksheetName = $worksheet[0]
		const worksheet = $worksheet[1]
		await worksheet.saveCompository()
		return [worksheetName, worksheet]
	}
}
export default Workbook
