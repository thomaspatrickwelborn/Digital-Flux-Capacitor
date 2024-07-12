const EcosystemConfig = {
  apps: [
    {
      name: "DFC-Configurator-Docubase",
      script: "./index.js",
      watch: [
        "./index.js",
        "./package.json",
        "./config/**/*.*",
        "./pilers/**/*.*"
      ],
      args: "--config \"./config/docubase.json\"",
      node_args: "--inspect=127.0.0.1:9231",
      execMode: "fork"
    }
  ]
}
module.exports = EcosystemConfig