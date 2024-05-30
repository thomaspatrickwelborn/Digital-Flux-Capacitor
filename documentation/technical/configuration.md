# DFC Configuration
1. [Capacitor](#Capacitor)
  
    1. [Spreadsheet-To-Filesystem Cycle](#Spreadsheet-To-Filesystem%20Cycle)
      A. Subcycles
        1. [Spreadsheet-To-Spreadsheet-Database](configuration-subcycles/spreadsheet-to-spreadsheet-database/index.md)
        2. [Spreadsheet-Database-To-Filesystem-Database](configuration-subcycles/spreadsheet-database-to-filesystem-database/index.md)
        3. [Filesystem-Database-To-Filesystem](configuration-subcycles/filesystem-database-to-filesystem/index.md)

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

## Spreadsheet-To-Filesystem (Cycle)
```
{
  "name": "spreadsheet-to-filesystem",
  "subcycles": [
    ["spreadsheet-to-spreadsheet-database", SpreadsheetToSpreadsheetDatabase]
  ]
}
```
