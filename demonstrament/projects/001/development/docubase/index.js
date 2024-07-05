import "./coutils/persist.js"
import path from "node:path"
import https from "node:https"
import http from "node:http"
import express from "express"
import ejs from "ejs"
const application = express()
const router = express.Router()
router.get(
  '/',
  function indexGet(
    $req, $res, $next
  )
  {
    console.log(
      $req, $res, $next
    )
  }
)
application.use(
  router
)