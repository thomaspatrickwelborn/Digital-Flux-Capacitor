export default {
  "name": "spreadsheet-to-filesystem",
  "classname": "SpreadsheetToFilesystem",
  "subcycles": [
    ["SpreadsheetToSpreadsheetDatabase", {
      "spreadsheet": {
        "worksheets": {
          "VINE": {
            "ranges": {
              "MOD_0": {
                "Class": "FSElement"
              }
            }
          },
          "VIEW": {
            "ranges": {
              "MOD_0": {
                "Class": "ViewScript"
              },
              "LMN_0_SUBSET": {
                "VAL": "ViewScript"
              },
              "LMN_0_SUPSET": {
                "VAL": "blocks"
              },
              "LMN_1_SUBSET": {
                "VAL": "ViewScript"
              },
              "LMN_1_SUPSET": {
                "VAL": "blocks"
              }
            }
          },
          "VERS": {
            "ranges": {
              "MOD_0": {
                "Class": "Script"
              },
              "LMN_0_SUBSET": {
                "VAL": "Script"
              },
              "LMN_0_SUPSET": {
                "VAL": "blocks"
              },
              "LMN_1_SUBSET": {
                "VAL": "Script"
              },
              "LMN_1_SUPSET": {
                "VAL": "blocks"
              }
            }
          },
          "VELI": {
            "ranges": {
              "MOD_0": {
                "Class": "Style"
              },
              "LMN_0_SUBSET": {
                "VAL": "Style"
              },
              "LMN_0_SUPSET": {
                "VAL": "blocks"
              },
              "LMN_1_SUBSET": {
                "VAL": "Style"
              },
              "LMN_1_SUPSET": {
                "VAL": "blocks"
              }
            }
          }
        }
      }
    }],
    ["SpreadsheetDatabaseToFilesystemDatabase", {}],
    ["FilesystemDatabaseToFilesystem", {
      "filesystemContent": {
        "CJS_Module": {
          "space": {
            "horizon": {
              "char": "  "
            },
            "verizon": {
              "char": "\n"
            }
          }
        },
        "JSON_File": {
          "space": {
            "horizon": {
              "char": "  "
            },
            "verizon": {
              "char": "\n"
            }
          }
        },
        "ES_Markup": {
          "space": {
            "horizon": {
              "char": "  "
            },
            "verizon": {
              "char": "\n"
            }
          }
        },
        "ES_Module": {
          "space": {
            "horizon": {
              "char": "  "
            },
            "verizon": {
              "char": "\n"
            }
          }
        },
        "CSS_Module": {
          "space": {
            "horizon": {
              "char": "  "
            },
            "verizon": {
              "char": "\n"
            }
          }
        },
        "SASS_File": {
          "space": {
            "horizon": {
              "char": "  "
            },
            "verizon": {
              "char": "\n"
            }
          }
        }
      }
    }]
  ]
}