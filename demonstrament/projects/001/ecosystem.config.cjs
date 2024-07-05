module.exports = {
  apps : [{
    name   : "DFC-Demo-001",
    script : "index.js",
    watch: [
      "./index.js", 
      "./config.json", 
      "./ecosystem.config.cjs",
      "../../../development",
    ],
    args:"--config \"./config.json\"",
    node_args: "--inspect",
    execMode: "fork"
  }]
}
