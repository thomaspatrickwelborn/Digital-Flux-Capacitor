# Digital Flux Capacitor Configuration
+ [Capacitor](#capacitor)
   + [Spreadsheet-To-Filesystem Cycle](#spreadsheet-to-filesystem-cycle) 
      - [Spreadsheet-To-Spreadsheet-Database Subcycle](subcycles/spreadsheet-to-spreadsheet-database/index.md)
      - [Spreadsheet-Database-To-Filesystem-Database](subcycles/spreadsheet-database-to-filesystem-database/index.md)
      - [Filesystem-Database-To-Filesystem](subcycles/filesystem-database-to-filesystem/index.md)

## Capacitor
```
{
  "project": {
    "name": "dfc-demo-001",
    "path": "development"
  },
  "cycles": [
    ["spreadsheet-to-filesystem", SpreadsheetToFilesystem]
  ],
}
```

### Spreadsheet To Filesystem (Cycle)
```
{
  "name": "spreadsheet-to-filesystem",
  "subcycles": [
    ["spreadsheet-to-spreadsheet-database", SpreadsheetToSpreadsheetDatabase]
  ]
}
```
