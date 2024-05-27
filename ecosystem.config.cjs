 module.exports = {
  apps : [{
    name   : "Digital-Flux-Capacitor",
    script : "development/index.js",
    watch: [
      "development"
    ],
    args:"--config \"demonstration/projects/photo-application/config.json\"",
    node_args: "--inspect --trace-deprecation",
    execMode: "fork"
  }]
}
