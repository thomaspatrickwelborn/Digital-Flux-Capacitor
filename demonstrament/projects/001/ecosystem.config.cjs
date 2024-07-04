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
    node_args: "--inspect=127.0.0.1:9229",
    execMode: "fork"
  }]
}
