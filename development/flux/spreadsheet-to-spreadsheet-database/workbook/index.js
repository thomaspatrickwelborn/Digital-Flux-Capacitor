import path from 'path'
import { EventEmitter } from 'node:events'
import * as XLSX from 'xlsx'
import * as fs from 'node:fs'
import Worksheet from '../worksheet/index.js'
import { Cell } from '#utils/tem/index.js'

XLSX.set_fs(fs)

class Workbook extends EventEmitter {
	constructor($settings) {
		super()
		const {
			workbookPath, workbook, dbConnection
		} = $settings
		this.#workbookPath = workbookPath
		this.name = path.basename(this.#workbookPath).split('.')[0]
		this.workbook = workbook
		this.#dbConnection = dbConnection
		const {
			Workbook,
			Sheets
		} = workbook
		return this.#setWorksheets(Workbook, Sheets)
	}
	#workbookPath
	name
	workbook
	#dbConnection
	worksheets = new Map()
	async #setWorksheets($Workbook, $Sheets) {
		const worksheets = this.worksheets
		const workbookWorksheets = $Workbook.Sheets
		const workbookWorksheetsLength = workbookWorksheets.length
		var workbookWorksheetsIndex = 0
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
				continue
			}
			const workbookWorksheetID = Number(workbookWorksheet.sheetId)
			const workbookWorksheetData = $Sheets[workbookWorksheetName]
			const workbookWorksheetRows = workbookWorksheetData['!rows'] || []
			const workbookWorksheetCols = workbookWorksheetData['!cols'] || []
			const workbookWorksheetMerges = workbookWorksheetData['!merges'] || []
			const workbookWorksheetRanges = $Workbook.Names.reduce((
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
			const worksheet = await new Worksheet({
				worksheetName: workbookWorksheetName,
				worksheetData: workbookWorksheetData,
				dbConnection: this.#dbConnection,
			})
			switch(worksheets.has(workbookWorksheetClassName)) {
				case true: 
					worksheets
					.get(workbookWorksheetClassName)
					.set(workbookWorksheetClassIndex, worksheet)
					break
				case false:
					worksheets
					.set(workbookWorksheetClassName, new Map([
						[workbookWorksheetClassIndex, worksheet]
					]))
					break
			}
			workbookWorksheetsIndex++
		}
		return this
	}
}

export default Workbook
