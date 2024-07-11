# Worksheet Configuration
+ [Worksheet](#worksheet)
   + [Ranges](#ranges)
      - [Range Areas](#range-areas)
      + [Range Models](#range-models)
         - [Range Model Supposit](#range-model-supposit)
         - [Range Model Composit](#range-model-composit)
   + [Element Ranges](element-ranges/index.md)

## Worksheet
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

### Ranges
```
Range {
  "s": { "r": $START_ROW, "c": $START_COL },
  "e": { "r": $END_ROW, "c": $END_COL },
}
```

#### Range Areas
- Areas describe data capture ranges. 
#### Range Models
- Models describe data capture objects. 
- Models become Mongoose Models. 
- There may be one or more Models each Worksheet. 
##### Range Model Supposit
- Model Supposits describe prototypal data capture object property definitions. 
- Model Supposits become Mongoose Schemata. 
##### Range Model Composit
- Model Composit describes serialized instantial data capture object property values. 
- Model Composits become Mongoose Documents. 
