# Spreadsheet-To-Spreadsheet-Database Subcycle
+ [Spreadsheet To Spreadsheet Database](#spreadsheet-to-spreadsheet-database)
   + [Spreadsheet](#spreadsheet)
      - [Worksheet](worksheet/index.md)
   + [Spreadsheet-Database](#spreadsheet-database)

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

