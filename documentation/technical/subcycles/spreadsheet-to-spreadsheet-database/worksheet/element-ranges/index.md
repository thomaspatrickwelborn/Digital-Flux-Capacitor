# Element Range Configuration
+ [Element Range](#element-range)
  + [Element Range Set](#element-range-set)
    - [Superset](#superset)
    - [Suberset](#suberset)
  + [Element Range Path](#element-range-path)
    - [Path Separator](#path-separator)
    - [Path Key](#path-key)

## Element Range
```
ElementRange {
  "set": {
    "super": String,
    "suber": String,
  },
  "path": {
    "enable": Boolean,
    "key": String,
    "separator": String,
  },
  "s": { "r": $START_ROW, "c": $START_COL },
  "e": { "r": $END_ROW, "c": $END_COL },
}
```
- Elements describe recursive propriation between Composits through own-named entities forming a directory structure in columnar range. 
### Element Range Set
#### Superset
- Element Superset describes property name of own parent element container. 
#### Suberset
- Element Suberset describes element model name. 

### Element Range Path
- Element Path describes recursive property location through ordered named entities in a directory structure. 
#### Path Separator
- Element Path Separator describes character that separates named entites in an Element Path. 
#### Path Key
- Element Path Key describes Element Path key name for data capture objects. 
