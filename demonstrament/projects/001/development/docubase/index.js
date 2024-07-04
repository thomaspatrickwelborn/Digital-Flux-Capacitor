import "./coutils/persist.js"
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