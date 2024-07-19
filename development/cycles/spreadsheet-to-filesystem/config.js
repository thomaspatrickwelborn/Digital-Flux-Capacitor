export default {
  "name": "spreadsheet-to-filesystem",
  "classname": "SpreadsheetToFilesystem",
  "subcycles": [
    ["SpreadsheetToSpreadsheetDatabase", {
      "spreadsheet": {
        "worksheets": {
          "VIEW": {
            "ranges": {
              "MOD": {
                "Class": "ViewScript"
              },
              "LMN_SUBSET": {
                "VAL": "ViewScript"
              },
              "LMN_SUPSET": {
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
          "VINE": {
            "ranges": {
              "MOD": {
                "Class": "FSElement"
              },
              "LMN_SUBSET": {
                "VAL": "FSElement"
              },
              "LMN_SUBSET": {
                "VAL": "fsElements"
              }
            }
          },
          "VELI": {
            "ranges": {
              "MOD": {
                "Class": "Style"
              },
              "LMN_SUBSET": {
                "VAL": "Style"
              },
              "LMN_SUPSET": {
                "VAL": "blocks"
              }
            }
          },
          "VERS": {
            "ranges": {
              "MOD": {
                "Class": "Script"
              },
              "LMN_SUBSET": {
                "VAL": "Script"
              },
              "LMN_SUPSET": {
                "VAL": "blocks"
              }
            }
          },
          "VORM": {
            "ranges": {
              "MOD": {
                "Class": "Markdown"
              },
              "LMN_SUBSET": {
                "VAL": "Markdown"
              },
              "LMN_SUPSET": {
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
        "MD_File": {
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