 module.exports = {
  apps : [{
    name   : "DFC-Demo-001",
    script : "index.js",
    watch: [
      "./index.js", "./utils"
    ],
    args:"--config \"./config.json\"",
    node_args: "--inspect --trace-deprecation",
    execMode: "fork"
  }]
}
