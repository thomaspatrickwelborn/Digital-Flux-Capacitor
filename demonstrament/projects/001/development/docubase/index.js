import express from "express"
import {
  Application,
  Router
} from "express"

const application  = Application (

const router  = Router (

router (
  '/' 
)

.get (
  function indexGet (
    $req, $res, $next 
  )
  {
    console.log (
      $req, $res, $next 
    )
  }
)

application.use (
  router 
)
