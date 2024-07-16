import fs from "node:fs/promises"
import https from "node:https"
import path from "node:path"
import cors from "cors"
import express from "express"
import DocubaseConfig from "./docubase.config.js"
import RollupConfig from "./rollup.config.js"
import SASSConfig from "./sass.config.js"
import EJSConfig from "./ejs.config.js"
import Pilers from "./pilers/index.js"
const rollupPiler =  new Pilers.Rollup(
  RollupConfig
)
rollupPiler.start()
const sassPiler =  new Pilers.SASS(
  SASSConfig
)
sassPiler.start()
const ejsPiler =  new Pilers.EJS(
  EJSConfig
)
ejsPiler.start()
const staticRoutes = DocubaseConfig.express.static.routes
const application = express()
application.use(
  cors()
)
application.use(
  express.static(
    'distribute/localhost'
  )
)
// HTTPS Server
const httpsServer =  await https.createServer(
  {
    key:  await fs.readFile(
      '/home/thomaspatrickwelborn/.certificates/demonstrament.dfc.001.docubase.key'
    ),
    cert:  await fs.readFile(
      '/home/thomaspatrickwelborn/.certificates/demonstrament.dfc.001.docubase.crt'
    ),
  },
  application
)
httpsServer.listen(
  3334,
  function httpsServerListen(){
    console.log(
      'docubase https server'
    )
  }
)