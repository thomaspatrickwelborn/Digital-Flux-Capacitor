import livereload from "livereload"
import connectLivereload from "connect-livereload"
import fs from "node:fs"
import path from "node:path"
import https from "node:https"
import http from "node:http"
import cors from "cors"
import express from "express"
import ejs from "ejs"
// Application
const application = express()
application.use(
  cors()
)
// LiveReload Server
const livereloadServer = livereload.createServer(
  {
    wait: 0
  }
)
livereloadServer.server.once(
  'connection',
  function livereloadServerOnceConnection(){
    setTimeout(
      () => {
        liveReloadServer.refresh(
          '/'
        )
      },
      100
    )
  }
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