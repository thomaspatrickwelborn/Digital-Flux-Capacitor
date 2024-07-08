import "./coutils/persist.js"
import {
  RollupPiler
} from "./pilers/index.js"
import fs from "node:fs"
import path from "node:path"
import https from "node:https"
import cors from "cors"
import express from "express"
import ejs from "ejs"
// Application
const rollupPiler =  new RollupPiler()
await rollupPiler.start()
const application = express()
application.use(
  cors()
)
application.use(
  express.static(
    'localhost'
  )
)
// HTTPS Server
const httpsServer = https.createServer(
  {
    key: fs.readFileSync(
      '/home/thomaspatrickwelborn/.certificates/demonstrament.dfc.001.docubase.key'
    ),
    cert: fs.readFileSync(
      '/home/thomaspatrickwelborn/.certificates/demonstrament.dfc.001.docubase.crt'
    ),
  },
  application
)
httpsServer.listen(
  3334,
  function httpsServerListen(){
    console.log('docubase https server')
  }
)