import express from "express"
import {
  Application,
  Router
} from "express"
import ejs from "ejs"
import EcosystemConfig from "ecosystem.config.cjs"
const application = Application()
const router = Router()
router(
  '/'
)
.get(
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