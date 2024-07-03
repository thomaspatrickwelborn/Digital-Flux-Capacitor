const EcosystemConfig = {
  apps: [
    name: "DFC-Configurator-Docubase",
    script: "index.js",
    watch: [
      "./index.js",
      "./config.json",
      "./ecosystem.config.cjs",
    ],
    args: "--config \"./config.json\"",
    node_args: "--inspect --trace-deprecation",
    exectMode: "fork"
  ]
}
module.exports = EcosystemConfig