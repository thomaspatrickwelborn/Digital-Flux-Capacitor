
const application=Application()
const router=Router()
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