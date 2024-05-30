# Spreadsheet-To-Spreadsheet-Database (Subcycle)
1. [Spreadsheet To Spreadsheet Database](#Spreadsheet-To-Spreadsheet-Database)
   1. [Spreadsheet](#Spreadsheet)
      1. [Worksheet](worksheet/index.md)
   2. [Spreadsheet-Database](#Spreadsheet-Database)

## Spreadsheet To Spreadsheet Database
```
SpreadsheetToSpreadsheetDatabase {
  "name": "spreadsheet-to-spreadsheet-database",
  "spreadsheet": Spreadsheet,
  "database": SpreadsheetDatabase,
}
```

### Spreadsheet
```
Spreadsheet {
  "path": $WORKBOOK_PATH,
  "worksheets": {
    [$SHEET_NAME]: Worksheet
  }
}
```

### Spreadsheet Database
```
SpreadsheetDatabase {
  "uri": "mongodb://127.0.0.1:27017/[$PROJECT_NAME]",
  "options": {}
}
```

