# Spreadsheet-To-Filesystem | Config
## Cycle Class Instance Config Properties
```
{
	name: String,
	classname: String,
	spreadsheet: {
		path: String,
		watch: Boolean,
		watcher: {
			options: {}
		},
		database: {
			uri: String,
			options: {}
		}
	},
	filesystem: {
		root: {
			path: String
		},
		content: {
			extrapolatory: {
				deleteExtraneous: Boolean
			}
		}
	}
}
```
## Cycle Class Config Properties
```
{

}
```
## Combined Properties
```
{
	name: String,
	classname: String,
	spreadsheet: {
		path: String,
		watch: Boolean,
		watcher: {
			options: {}
		},
		database: {
			uri: String,
			options: {}
		},
		worksheets: {
			[$worksheetName]: {
				ranges: {
					[$MOD_$MODINDEX]: {
						Class: String
					},
					[$LMN_$LMNINDEX_SUBSET]: {
						VAL: String
					},
					[$LMN_$LMNINDEX_SUPSET]: {
						VAL: String
					}
				}
			}
		}
	},
	filesystem: {
		root: {
			path: String
		},
		content: {
			extrapolatory: {
				deleteExtraneous: Boolean,
				generatives: {
					file: {
						templates: {
							[$templateName]: {
								space: {
									horizon: {
										char: "  "
									},
									verizon: {
										char: "\n"
									}
								}
							}
						}
					}
				}
			},
			extrapository: {}
		},
		database: {
			uri: String,
			options: {}
		}
	}
}
```