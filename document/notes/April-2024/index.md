# 04/03/2024

# 04/02/2024
## Spreadsheet-To-Spreadsheet-Database Subcycle
Continue editing Worksheet Class "Get LMN Ranges" Method 

# 04/01/2024
## Spreadsheet-To-Spreadsheet-Database Subcycle
### Supposit LMN Range Property Definitions
Supposit LMN Range Property Keys and Vals may be stored in multiple places with different effects: 
#### LMN Property Range Name
LMN Prop Range Name defines a PROP KEY.
##### LMN SUPSET Property
Entered Element contained by Supter Element's `$KEY` Prop Array Val  

###### Table
```
|   |A  |B C D  |E   |
|1  |id |name   |type|
|2  |---|-------|----|
|3  |  0|AAA    |Fold|
|4  |  1|  BBB  |File|
|5  |  2|  CCC  |Fold|
|6  |  3|    DDD|File|


```

###### Table LMN Ranges
```
[{
	"Name": "LMN_0",
	"Ref": {
		"s": {
			"r": 0,
			"c": 1,
		},
		"e": {
			"r": 6,
			"c": 3,
		},
	}
},{
	"Name": "LMN_0_SUPSET_fsElements",
	"Ref": {
		"s": {
			"r": 0,
			"c": 1,
		},
		"e": {
			"r": 6,
			"c": 3,
		},
	}
}]
```


###### Supposit
```
{
	"id": Number,
	"name": String,
	"fsElements": [{
		"type": ObjectId,
		"ref": "File",
	}, {
		"type": ObjectId,
		"ref": "Fold",
	}]
}
```

###### Composit
```
[{
	"id": 0,
	"name": "AAA",
	"type": "Fold",
	"fsElements": [{
		"id": 1,
		"name": "BBB",
		"type": "File",
	}, {
		"id": 2,
		"name": "CCC",
		"type": "Fold",
		"fsElements": [{
			"id": 3,
			"name": "DDD",
			"type": "File"
		}]
	}]
}]
```

#### LMN PROP Range Ref
LMN PROP Range Ref defines a PROP KEY.

#### LMN Range
#### LMN SUPSET Range
- When LMN Range and LMN SUPSET Range are the same
#### LMN SUBSET Range
#### LMN PAT Range