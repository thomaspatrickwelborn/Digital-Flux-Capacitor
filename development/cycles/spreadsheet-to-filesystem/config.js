export default {
  "name": "spreadsheet-to-filesystem",
  "classname": "SpreadsheetToFilesystem",
  "subcycles": [
    ["SpreadsheetToSpreadsheetDatabase", {
      "spreadsheet": {
        "worksheets": {
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
          "VINE": {
            "ranges": {
              "MOD_0": {
                "Class": "FSElement"
              },
              "LMN_0_SUBSET": {
                "VAL": "FSElement"
              },
              "LMN_0_SUPSET": {
                "VAL": "fsElements"
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
              }
            }
          },
          "VORM": {
            "ranges": {
              "MOD_0": {
                "Class": "Markdown"
              },
              "LMN_0_SUBSET": {
                "VAL": "Markdown"
              },
              "LMN_0_SUPSET": {
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