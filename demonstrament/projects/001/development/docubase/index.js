import ./coutils/persist.js
import express from "express"
import ejs from "ejs"
console.log(
  "Hello All Dogs"
)
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