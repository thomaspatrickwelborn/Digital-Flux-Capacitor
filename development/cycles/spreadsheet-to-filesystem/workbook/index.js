import { EventEmitter } from 'node:events'
import path from 'path'
import Worksheet from '../worksheet/index.js'

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
		this.fsElementWorksheets = this.#createWorksheets(
			this.#getWorksheetsByClassName(
				new RegExp(/^VINE/)
			)
		)
		console.log(this.fsElementWorksheets)
		this.fsElementContentWorksheets = this.#createWorksheets(
			this.#getWorksheetsByClassName(
				new RegExp(/^VANT|^VELI|^VERS|^VIEW|^VORM/)
			)
		)
			ole.log(this.fsElementContentWorksheets)
	}
	get workbook() { return this.#_workbook }
	set workbook($workbook) { this.#_workbook = Object.freeze($workbook) }
	get worksheets() { return this.#_worksheets }
	#getWorksheetsByClassName($workbookWorksheetClassName) {
		const { Workbook, Sheets } = this.workbook
		const worksheets = Workbook.Sheets
		.filter(($workbookWorksheet) => {
			return $workbookWorksheet.name.match($workbookWorksheetClassName)
		})
		return worksheets
	}
	#createWorksheets($worksheets) {
		console.log('$worksheets', $worksheets)
		const worksheetsLength = $worksheets.length
		var worksheetsIndex = 0
		iterateWorksheets: 
		while(worksheetsIndex < worksheetsLength) {
			const worksheet = $worksheets[worksheetsIndex]
			this.#createWorksheet(worksheet)
			worksheetsIndex++
		}
	}
	#createWorksheet($worksheet) {
		console.log('$worksheet', $worksheet)
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
		console.log(this.#settings.worksheets)
		const worksheetOptions = this.#settings.worksheets[worksheetClassName] || {}
		console.log('worksheetOptions', Object.keys(worksheetOptions))
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
		this.worksheets
		.set(worksheetName, worksheet)
	}
	async saveWorksheets($worksheets) {
		for(const $worksheet of $worksheets) {
			await this.saveWorksheet($worksheet)
		}
	}
	async saveWorksheet($worksheet) {
		console.log(this.worksheets)
		const worksheet = this.worksheets.get($worksheet.name)
		console.log('saveWorksheet', worksheet)
		// await $worksheet.saveCompository()
		// this.emit('worksheet:save', $worksheet)
	}
}
export default Workbook
