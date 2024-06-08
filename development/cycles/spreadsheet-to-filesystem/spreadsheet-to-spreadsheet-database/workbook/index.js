import { EventEmitter } from 'node:events'
import path from 'path'
import Worksheet from '../worksheet/index.js'

class Workbook extends EventEmitter {
	#workbookPath
	name
	#settings
	#dbConnection
	constructor($settings) {
		super()
		this.#settings = $settings
		const {
			workbookPath, workbook, worksheets, dbConnection
		} = this.#settings
		this.#dbConnection = dbConnection
		this.#workbookPath = workbookPath
		this.name = path.basename(this.#workbookPath).split('.')[0]
		this.workbook = workbook
		this.worksheets = worksheets
	}
	#_workbook
	get workbook() { return this.#_workbook }
	set workbook($workbook) { this.#_workbook = Object.freeze($workbook) }
	#_worksheets = new Map()
	get worksheets() { return this.#_worksheets }
	set worksheets($worksheets) {
		const { Workbook, Sheets } = this.workbook
		const _workbook = this.#_workbook
		const _worksheets = this.#_worksheets
		const workbookWorksheets = Workbook.Sheets
		const workbookWorksheetsLength = workbookWorksheets.length
		var workbookWorksheetsIndex = 0
		iterateWorkbookWorksheets: 
		while(workbookWorksheetsIndex < workbookWorksheetsLength) {
			const workbookWorksheet = workbookWorksheets[workbookWorksheetsIndex]
			const workbookWorksheetNameData = workbookWorksheet.name.split('_')
			const workbookWorksheetClassName = workbookWorksheetNameData[0] 
			const workbookWorksheetClassIndex = workbookWorksheetNameData[1] || 0
			const workbookWorksheetName = workbookWorksheet.name
			const workbookWorksheetHidden = workbookWorksheet.Hidden
			if(
				workbookWorksheet === undefined ||
				workbookWorksheetHidden === 1
			) {
				workbookWorksheetsIndex++
				continue iterateWorkbookWorksheets
			}
			const workbookWorksheetID = Number(workbookWorksheet.sheetId)
			const workbookWorksheetTable = Sheets[workbookWorksheetName]
			const workbookWorksheetRows = workbookWorksheetTable['!rows'] || []
			const workbookWorksheetCols = workbookWorksheetTable['!cols'] || []
			const workbookWorksheetMerges = workbookWorksheetTable['!merges'] || []
			const workbookWorksheetRanges = Workbook.Names.reduce((
				$worksheetRanges, $worksheetRange
			) => {
				if(
					$worksheetRange.Sheet === undefined || 
					$worksheetRange.Sheet === workbookWorksheetID - 1
				) $worksheetRanges.push($worksheetRange)
				return $worksheetRanges
			}, [])
			const workbookWorksheetOptions = $worksheets[workbookWorksheetClassName] || {}
			workbookWorksheetTable['!rows'] = workbookWorksheetRows
			workbookWorksheetTable['!cols'] = workbookWorksheetCols
			workbookWorksheetTable['!merges'] = workbookWorksheetMerges
			workbookWorksheetTable['!ranges'] = workbookWorksheetRanges
			const worksheet = new Worksheet({
				worksheetClassName: workbookWorksheetClassName,
				worksheetName: workbookWorksheetName,
				worksheetTable: workbookWorksheetTable,
				dbConnection: this.#dbConnection,
			}, workbookWorksheetOptions)
			_worksheets
			.set(workbookWorksheetName, worksheet)
			workbookWorksheetsIndex++
		}
		return this
	}
	async saveWorksheets() {
		for(const $worksheet of this.#_worksheets.values()) {
			await $worksheet.saveCompository()
		}
	}
}
export default Workbook
