import "./coutils/persist.js"
import fs from "node:fs"
import path from "node:path"
import https from "node:https"
import http from "node:http"
import cors from "cors"
import express from "express"
import ejs from "ejs"
const application = express()
application.use(
  cors()
)
application.get(
  '/',
  function indexGet(
    $request, $response, $next
  )
  {
    $response.send(
      "Hello all dogs!"
    )
  }
)
const httpServer = http.createServer(
  application
)
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
application.listen(
  3000,
  function applicationListen(){
    console.log(
      'Listen To The Sound Of Silence'
    )
  }
)
console.log(
  application
)