# Spreadsheet-To-Spreadsheet-Database (Subcycle)
```
SpreadsheetToSpreadsheetDatabase {
  "name": "spreadsheet-to-spreadsheet-database",
  "spreadsheet": Spreadsheet,
  "database": SpreadsheetDatabase,
}
```

## Spreadsheet
```
Spreadsheet {
  "path": $WORKBOOK_PATH,
  "worksheets": {
    [$SHEET_NAME]: Worksheet
  }
}
```

## Spreadsheet Database
```
SpreadsheetDatabase {
  "uri": "mongodb://127.0.0.1:27017/[$PROJECT_NAME]",
  "options": {}
}
```

