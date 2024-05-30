# Element Range

```
ElementRange {
  "set": {
    "super": STRING,
    "suber": STRING,
  },
  "path": {
    "enable": BOOLEAN,
    "key": STRING,
    "separator": STRING,
  },
  "s": { "r": $START_ROW, "c": $START_COL },
  "e": { "r": $END_ROW, "c": $END_COL },
}
```
- Elements describe recursive propriation between Composits through own-named entities forming a directory structure in columnar range. 
## Set
### Super
- Element Superset describes property name of own parent element container. 
### Suber
- Element Suberset describes element model name. 

## Path
- Element Path describes recursive property location through ordered named entities in a directory structure. 
### Enable
- 
### Separator
- Element Path Separator describes character that separates named entites in an Element Path. 
### Key
- Element Path Key describes Element Path key name for data capture objects. 
