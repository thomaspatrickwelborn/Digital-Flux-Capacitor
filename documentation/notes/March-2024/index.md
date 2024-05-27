# Spreadsheet To Database

## 03/31/2024
### LMN Range Property Definition Rules
#### Properties
##### LMN
##### SUPSET
##### SUBSET
##### PAT
#### Naming Conventions
##### LMN Range Declaration
```
LMN_$INDEX
```
##### LMN Range Property Declaration
```
LMN_$INDEX_$PROPKEY_$MODKEY
```
```
LMN_$INDEX_$PROPkEY
```
#### Worksheet Named Ranges

#### Usage Cases
##### Mod-Scoped Element Supset/Subset Name
##### Element-Scoped Element Supset/Subset Name 

## 03/28/2024
### Address Path Property Definition Errors
- Assigning both "PAT" and "path" properties
- Inconsistent pathing rules in spreadsheet designment. 

## 03/27/2024
### Compound Differentiated Recursion Between Two Element Sets With Two Element Ranges

## 03/27/2024
### Elemental Recursion Design Rules
#### VIEW Sheet
- Statement/Element Properties Must Occur In Left-To-Right Order
  - 
- Statement Lexter/Dexter Properties Must Occur In Left-To-Right Order
  - Lexter (3+ Columns)
    - Ser (1 Required Column)
    - Ten (1+ Required Column(s))
    - Per (1 Required Column)
    - Ple (1 Optional Column)
  - Dexter (3-4 Columns)
    - Ser (1 Required Column)
    - Ten (1 Required Column)
    - Per (1 Required Column)
    - Ple (1 Optional Column)


No Defined Value For Module Posit Row LMN Range
  - Detect Reserved Words:
    - 

## 03/26/2024
### Elemental Recursion Design
- Element Sets
  - Single Element Set
  - Multiple Element Sets
- Element Ranges
  - Single Element Range
  - Multiple Element Ranges

### Elemental Recursion Types
1. Elemental Recursion
  - In the same Element Range, Elements in an Element Set may contain other Elements from the same Element Set. 
    - One Element Range
    - One Element Set
2. Compound Elemental Recursion
  - In the same Element Range, Elements of two or more Element Sets may contain other Elements from any of the Element Sets. 
    - One Element Range
    - More Than One Element Sets
3. Differentiated Elemental Recursion
  - In different Element Ranges, Elements in an Element Set may contain other Elements from the same Element Set. 
    - More Than One Element Ranges
    - One Element Set
4. Compound Differentiated Elemental Recursion
  - In different Element Ranges, Elements of two or more Element Sets may contain other Elements from any of the Elements Sets. 
    - More Than One Elemental Ranges
    - More Than One Elemental Sets

### Elemental Recursion Properties
1. Element Range
  - Defines An Element's Name And Relative Position
2. Element Supter Range
  - Defines An Element Container's Property Key Name
3. Element Subter Range
  - Defines An Element's Set Name
4. Element Path Range
  - Defines An Element's Delimiter-Separated Absolute Position

## 03/25/2024
```
const FSSchema = {
  id: Number,
  path: String,
}
const StatementSchema = {
  lexter: {
    ser: String,
    ten: String,
    per: String,
    ple: String,
  },
  dexter: {
    ser: String,
    ten:, String,
    per: String,
    ple: String,
  }
}
ElementSchema = {
  tag: {
    per: String,
    name: String,
  },
  attribute: {
    id: String, 
    class: String,
    src: String,
    alt: String,
  },
  data: {
    id: String,
  },
}
const ViewSchema = {
  fs: FSSchema,
  statement: StatementSchema,
  element: ElementSchema,
  blocks: [StatementSchema, ElementSchema],
}
```

## 03/18/2024
- Define Filesystem Database Model Schemata
- Define Nested Path Properties For LMN_PAT Range in Spreadsheet-To-Spreadsheet-Database Subcycle

## 03/18/2024
- Eliminate VIRE Spreadsheet in favor of VARI Spreadsheet
  - Decision: No VIRE Spreadsheet elimination
    - Reason: Serves distinct purpose of environment configuration. 

## 03/17/2024
- LMN Range must have nested property ability. 
- This issue may have already been resolved in a prior version. 

## 03/15/2024
- Review Merge Cell Issue
  - There are over 10000 merge cell entries when there should be less than 100. 