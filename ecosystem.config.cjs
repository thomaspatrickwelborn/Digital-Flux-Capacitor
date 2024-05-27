 module.exports = {
  apps : [{
    name   : "spreadsheet-to-database",
    script : "development/index.js",
    watch: [
      "development"
    ],
    args:"--config \"demonstration/projects/photo-application/config.json\"",
    node_args: "--inspect --trace-deprecation",
    execMode: "fork"
  }, {
    name   : "mvc-framework",
    script : "development/index.js",
    watch: [
      "development"
    ],
    args:"--config \"demonstration/projects/mvc-framework/config.json\"",
    node_args: "--inspect --trace-deprecation",
    execMode: "fork"
  }]
}
