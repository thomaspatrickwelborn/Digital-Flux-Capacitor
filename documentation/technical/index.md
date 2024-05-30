# Digital Flux Capacitor Configuration
1. [Capacitor](#Capacitor)
   1. [Spreadsheet-To-Filesystem Cycle](#Spreadsheet-To-Filesystem)  
      1. [Spreadsheet-To-Spreadsheet-Database](configuration-subcycles/spreadsheet-to-spreadsheet-database/index.md)
         1. [Spreadsheet](configuration-subcycles/spreadsheet-to-spreadsheet-database/#Spreadsheet)
            1. [Worksheet](configuration-subcycles/spreadsheet-to-spreadsheet-database/worksheet/index.md)
               1. [Areas](#Areas)
               2. [Models](#Models)
                  1. [Model Supposit](#Model-Supposit)
                  1. [Model Composit](#Model-Composit)
            2. [Ranges](ranges/index.md)
            3. [Element Ranges](element-ranges/index.md)
         2. [Spreadsheet-Database](configuration-subcycles/spreadsheet-to-spreadsheet-database/#Spreadsheet-Database)
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

### Spreadsheet To Filesystem
```
{
  "name": "spreadsheet-to-filesystem",
  "subcycles": [
    ["spreadsheet-to-spreadsheet-database", SpreadsheetToSpreadsheetDatabase]
  ]
}
```
