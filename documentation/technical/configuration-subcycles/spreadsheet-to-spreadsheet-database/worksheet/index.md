# Worksheet
1. [Worksheet](#Worksheet)
   1. [Areas](#Areas)
   2. [Models](#Models)
      1. [Model Supposit](#Model-Supposit)
      1. [Model Composit](#Model-Composit)
   2. [Ranges](ranges/index.md)
   3. [Element Ranges](element-ranges/index.md)
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

## Ranges - Areas
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
