# Spreadsheet-To-Spreadsheet-Database (Subcycle)
```
{
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

### Worksheet
```
Worksheet {
  "ranges": {
    "areas": {
      [$AREA_NAME]: $RANGE,
    },
    "models": {
      [$MODEL_NAME]: $RANGE,
    },
    "elements": {
     [$ELEMENT_NAME]: $ELEMENT_RANGE,
    },
  }
}
```

#### Range
```
Range {
  "s": { "r": $START_ROW, "c": $START_COL },
  "e": { "r": $END_ROW, "c": $END_COL },
}
```

### Ranges
### Areas
- Areas describe data capture ranges. 
### Models
- Models describe data capture objects. 
- Models become Mongoose Models. 
- There may be one or more Models each Worksheet. 
### Model Supposit
- Model Supposits describe prototypal data capture object property definitions. 
- Model Supposits become Mongoose Schemata. 
### Model Composit
- Model Composit describes serialized instantial data capture object property values. 
- Model Composits become Mongoose Documents. 
### Elements


## Element Range

```
$ELEMENT_RANGE {
  "supterSet": STRING,
  "subterSet": STRING,
  "path": STRING,
  "pathSeparator": STRING,
  "pathKey": STRING,
  "s": { "r": $START_ROW, "c": $START_COL },
  "e": { "r": $END_ROW, "c": $END_COL },
}
```
- Elements describe recursive propriation between Composits through own-named entities forming a directory structure in columnar range. 
### Element Superset
- Element Superset describes property name of own parent element container. 
### Element Suberset
- Element Suberset describes element model name. 
### Element Path
- Element Path describes recursive property location through ordered named entities in a directory structure. 
### Element Path Separator
- Element Path Separator describes character that separates named entites in an Element Path. 
### Element Path Key
- Element Path Key describes Element Path key name for data capture objects. 
