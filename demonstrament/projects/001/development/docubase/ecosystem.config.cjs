const EcosystemConfig = {
  apps: [
    {
      name: "DFC-Configurator-Docubase",
      script: "index.js",
      watch: [
        "./package.json",
        "./config.json",
        "./ecosystem.config.ejs",
        "./index.js",
        "./pages/**/*.*",
        "./templates/**/*.*"
      ],
      args: "--config \"./config.json\"",
      node_args: "--inspect=127.0.0.1:9230",
      execMode: "fork"
    }
  ]
}
module.exports = EcosystemConfig