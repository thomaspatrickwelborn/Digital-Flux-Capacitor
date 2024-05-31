import path from 'path'
import { EventEmitter } from 'node:events'
import Worksheet from '../worksheet/index.js'

class Workbook extends EventEmitter {
	#workbookPath
	name
	
	#dbConnection
	constructor($settings) {
		super()
		const {
			workbookPath, workbook, dbConnection
		} = $settings
		this.#workbookPath = workbookPath
		this.name = path.basename(this.#workbookPath).split('.')[0]
		this.workbook = workbook
		this.worksheets = this.workbook
		this.#dbConnection = dbConnection
	}
	#_workbook
	get workbook() { return this.#_workbook }
	set workbook($workbook) { this.#_workbook = Object.freeze($workbook) }
	#_worksheets = new Map()
	get worksheets() { return this.#_worksheets }
	set worksheets($workbook) {
		const { Workbook, Sheets } = this.workbook
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
			const workbookWorksheetData = Sheets[workbookWorksheetName]
			const workbookWorksheetRows = workbookWorksheetData['!rows'] || []
			const workbookWorksheetCols = workbookWorksheetData['!cols'] || []
			const workbookWorksheetMerges = workbookWorksheetData['!merges'] || []
			const workbookWorksheetRanges = Workbook.Names.reduce((
				$worksheetRanges, $worksheetRange
			) => {
				if(
					$worksheetRange.Sheet === undefined || 
					$worksheetRange.Sheet === workbookWorksheetID - 1
				) $worksheetRanges.push($worksheetRange)
				return $worksheetRanges
			}, [])
			workbookWorksheetData['!rows'] = workbookWorksheetRows
			workbookWorksheetData['!cols'] = workbookWorksheetCols
			workbookWorksheetData['!merges'] = workbookWorksheetMerges
			workbookWorksheetData['!ranges'] = workbookWorksheetRanges
			const worksheet = new Worksheet({
				worksheetName: workbookWorksheetName,
				worksheetData: workbookWorksheetData,
				dbConnection: this.#dbConnection,
			})
			_worksheets
			.set(workbookWorksheetClassName, worksheet)
			workbookWorksheetsIndex++
		}
		return this
	}
	async start() {
		for(const $worksheet of this.worksheets.values()) {
			await $worksheet.start()
		}
		return this
	}
}

export default Workbook
